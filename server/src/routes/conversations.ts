import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Récupérer toutes les conversations de l'utilisateur
router.get('/', requireAuth, async (req, res) => {
  const userId = req.user!.id;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            images: {
              orderBy: { position: 'asc' },
              take: 1
            }
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true
                  }
                },
                agency: {
                  select: {
                    name: true,
                    logo: true
                  }
                }
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                readAt: null
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    res.json(conversations);
  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer une conversation spécifique
router.get('/:id', requireAuth, async (req, res) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true,
            images: {
              orderBy: { position: 'asc' },
              take: 1
            },
            status: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true
                  }
                },
                agency: {
                  select: {
                    name: true,
                    logo: true
                  }
                }
              }
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const isMember = conversation.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    res.json(conversation);
  } catch (error) {
    console.error('Erreur récupération conversation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Créer ou récupérer une conversation existante
router.post('/', requireAuth, async (req, res) => {
  const { propertyId, message } = req.body;
  const userId = req.user!.id;

  if (!propertyId) {
    return res.status(400).json({ error: 'propertyId est requis' });
  }

  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ error: 'Annonce non trouvée' });
    }

    const ownerId = property.ownerId;

    if (ownerId === userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous contacter vous-même' });
    }

    // Chercher s'il y a déjà une conversation entre ces deux membres pour ce bien
    const existingConversations = await prisma.conversation.findMany({
      where: {
        propertyId: propertyId,
        AND: [
          { members: { some: { userId: userId } } },
          { members: { some: { userId: ownerId } } }
        ]
      },
      include: {
        messages: true,
        members: true
      }
    });

    let conversation;

    if (existingConversations.length > 0) {
      conversation = existingConversations[0];
      
      if (message) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: message
          }
        });
        
        await prisma.conversation.update({
          where: { id: conversation.id },
          data: { updatedAt: new Date() }
        });
      }
    } else {
      conversation = await prisma.conversation.create({
        data: {
          propertyId: propertyId,
          members: {
            create: [
              { userId: userId },
              { userId: ownerId }
            ]
          }
        }
      });

      if (message) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: userId,
            content: message
          }
        });
      }
    }

    res.status(201).json({ conversationId: conversation.id });
  } catch (error) {
    console.error('Erreur création conversation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Envoyer un message dans une conversation
router.post('/:id/messages', requireAuth, async (req, res) => {
  const id = req.params.id as string;
  const { content } = req.body;
  const userId = req.user!.id;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Le message ne peut pas être vide' });
  }

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        members: true
      }
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    const isMember = conversation.members.some((m: any) => m.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        content: content.trim()
      }
    });

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    // Optionnel: Créer une notification pour l'autre/les autres participants ici
    // const otherMembers = conversation.members.filter(m => m.userId !== userId);
    // ... insert notification for each otherMembers

    res.status(201).json(message);
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Marquer les messages comme lus
router.patch('/:id/read', requireAuth, async (req, res) => {
  const id = req.params.id as string;
  const userId = req.user!.id;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { members: true }
    });

    if (!conversation || !conversation.members.some((m: any) => m.userId === userId)) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    await prisma.message.updateMany({
      where: {
        conversationId: id,
        senderId: { not: userId },
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur marquage lecture:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
