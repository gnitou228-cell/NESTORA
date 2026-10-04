import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const {
  PORT,
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_ID,
  VERIFY_TOKEN,
  OPENAI_API_KEY
} = process.env;

let openai: OpenAI | null = null;
if (OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });
}

// Verification route for Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Message reception route
app.post('/webhook', async (req, res) => {
  const body = req.body;
  console.log("=== WEBHOOK REÇU ===");
  console.log(JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account') {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0] && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const message = body.entry[0].changes[0].value.messages[0];
      
      if (message.type === 'text') {
        const from = message.from; // Sender's phone number
        const text = message.text.body; // Message content
        const contactName = body.entry[0].changes[0].value.contacts?.[0]?.profile?.name || "Cher client";
        
        console.log(`Message reçu de ${from} (${contactName}): ${text}`);
        
        try {
          // Attendre la réponse de l'IA AVANT de renvoyer 200 à Facebook
          // (Sinon Vercel coupe la fonction Serverless immédiatement)
          await respondWithAI(from, text, contactName);
          res.sendStatus(200);
        } catch (error) {
          console.error('Erreur lors du traitement du message', error);
          res.sendStatus(500);
        }
      } else {
        res.sendStatus(200); // Ignore non-text messages
      }
    } else {
      res.sendStatus(200);
    }
  } else {
    res.sendStatus(404);
  }
});

async function respondWithAI(phone: string, text: string, contactName: string) {
  if (!openai) {
    console.log("Clé OpenAI manquante, mode écho activé.");
    return sendWhatsAppMessage(phone, `🤖 Bonjour ${contactName}, vous avez dit: ${text}\n\n(Configurez la clé OpenAI pour des réponses intelligentes)`);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es l'assistant commercial officiel de Jeff Digital.
Ton rôle principal est de vendre automatiquement les produits et services de Jeff Digital sur WhatsApp.
Tu dois agir comme un commercial professionnel, chaleureux, rapide, naturel et orienté vers la conversion.

LE CLIENT :
Son nom WhatsApp est : "${contactName}".
Son numéro de téléphone est : "${phone}".
👉 Instruction : Salue toujours le client par son nom ("Bonjour ${contactName}...") de façon naturelle lors du premier message, MAIS ne répète plus "Bonjour" à chaque message ensuite.

RÈGLE DES PRIX (CRITIQUE) :
⚠️ NE JAMAIS utiliser les anciens prix de 1 000 FCFA ou 5 000 FCFA.
Prix actuel : Chaque produit individuel est à 1 300 FCFA.
Ne dis jamais "avant c'était 1 000 FCFA" ou "le package est à 5 000 FCFA". Ne crée jamais de réduction.

CATALOGUE JEFF DIGITAL :
FORMATIONS : 30 Jours pour Percer sur les Réseaux Sociaux, Formation complète en Marketing Digital et Community Management, Formation professionnelle au montage vidéo avec CapCut, Formation complète Adobe Premiere Pro, Formation complète FL Studio.
OUTILS PREMIUM : Canva Pro, CapCut Pro, Filmora, InShot Pro, Veo 3, Gemini.
BIBLIOTHÈQUES : Bibliothèque de 160 livres numériques, Bibliothèque de 200 livres audio, Pack de 250 applications premium Android, 36 vidéos pour apprendre Adobe Premiere Pro (tous avec droits de revente).
SERVICES : Création de compte TikTok monétisable, Création chaîne YouTube/Page Facebook, Accompagnement monétisation, Création de boutique en ligne/site web, Gestion de publicité.

INSTRUCTIONS DE CONVERSATION :
1. Accueil : "Bonjour 👋 Bienvenue chez Jeff Digital ! Je suis l'assistant virtuel. Que recherchez-vous ?"
2. Naturel : Ne redemande pas ce que tu sais déjà.
3. Présentation produit : Donne le nom, à quoi il sert, avantage, Prix (1 300 FCFA), et propose le paiement.
4. Passage à l'achat : Si le client dit "Je veux", "Comment payer", arrête les explications et donne les instructions de paiement.

INSTRUCTIONS DE PAIEMENT (CRITIQUE) :
Tu dois analyser l'indicatif du numéro du client (${phone}) pour lui proposer LE SEUL MOYEN DE PAIEMENT adapté à son pays. 
1. Si le numéro commence par "226" (Burkina Faso) : Propose uniquement Orange Money au +22605158494 OU Wave au +22605158494. (Nom à vérifier : Gnitou Essowedeou).
2. Si le numéro commence par "229" (Bénin) : Propose uniquement MTN Mobile Money au +2290162639593. (Nom à vérifier : Gnitou Essowedeou).
3. Si le pays utilise Wave (ex: "225" CI, "221" SN, etc.) : Propose Wave au +22605158494. (Nom à vérifier : Gnitou Essowedeou).
4. Si c'est un autre pays (ex: "243" Congo, Europe, etc.) : Dis avec bienveillance que les paiements internationaux arrivent bientôt, et qu'un conseiller va prendre le relais.

PREUVE DE PAIEMENT :
Après avoir donné le paiement, demande TOUJOURS une capture d'écran.
Si le client dit qu'il a payé ou envoyé la capture, ajoute le code secret [ALERTE_PAIEMENT] tout à la fin de ta réponse.`
      },
      { role: 'user', content: text }
    ]
  });

  let reply = completion.choices[0].message.content || 'Désolé, je ne peux pas répondre pour le moment.';
  
  // Interception de l'alerte
  if (reply.includes('[ALERTE_PAIEMENT]')) {
    reply = reply.replace('[ALERTE_PAIEMENT]', '').trim();
    
    // Envoi de l'alerte sur le vrai numéro personnel de Jeff
    if (process.env.ADMIN_PHONE_NUMBER) {
      await sendWhatsAppMessage(
        process.env.ADMIN_PHONE_NUMBER, 
        `🚨 *ALERTE PAIEMENT CLIENT* 🚨\n\nLe client au numéro *${phone}* indique avoir payé ou demande sa livraison.\n\nSon message : "${text}"\n\nAllez vite discuter avec lui sur WhatsApp !`
      );
    } else {
      console.log("ALERTE: Un client a payé mais ADMIN_PHONE_NUMBER n'est pas configuré sur Vercel !");
    }
  }

  await sendWhatsAppMessage(phone, reply);
}

async function sendWhatsAppMessage(to: string, body: string) {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.log(`[SIMULATION WHATSAPP] Vers ${to}: ${body}`);
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`Réponse envoyée à ${to}`);
  } catch (error: any) {
    console.error('Erreur lors de l\'envoi du message WhatsApp:', error.response?.data || error.message);
  }
}

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT || 3000, () => {
    console.log(`🤖 Agent WhatsApp NESTORA démarré sur le port ${PORT || 3000}`);
    console.log(`Vérification Webhook: http://localhost:${PORT || 3000}/webhook`);
  });
}

export default app;
