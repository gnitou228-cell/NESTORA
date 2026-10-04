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
        content: `Tu es un assistant commercial expert en vente de produits numériques.
Ton but est d'accueillir les clients, de leur présenter nos offres et de conclure des ventes.
Sois persuasif, chaleureux et professionnel. Utilise des emojis.

LE CLIENT :
Son nom WhatsApp est : "${contactName}".
Son numéro de téléphone est : "${phone}".
👉 Instruction : Salue toujours le client par son nom ("Bonjour ${contactName}...") de façon naturelle.

NOTRE CATALOGUE :
🟥 *CHAQUE PRODUIT EST À 1000 F CFA* 
✅ *LE PACK COMPLET (TOUT EN MÊME TEMPS) EST À 5000 F CFA* 

Produits disponibles :
⭕ 30 Jours pour percer sur les réseaux sociaux
⭕ Apprendre à monter des vidéos avec capcut comme un pro 
⭕ Formation complète en marketing digital et Community management 
⭕ Canva pro 
⭕ Capcut Pro 
⭕ FILMORA 
⭕ Inshort Pro 
⭕ Bibliothèque de 160 livres numériques (avec droit de revente) 
⭕ Bibliothèque de 200 livres audio (Avec droit de revente) 
⭕ Veo 3 et gemini 
⭕ Packs de 250 applications premium pour Android (avec droit de revente) 
⭕ 36 vidéo pour apprendre adobe premier pro (avec droit de revente) 
⭕ Formations complète pour maîtriser FL Studio (avec droit de revente)
⭕ Création de compte tiktok monétiser

INSTRUCTIONS DE PAIEMENT (CRITIQUE) :
Tu dois analyser l'indicatif du numéro du client (${phone}) pour lui proposer LE SEUL MOYEN DE PAIEMENT adapté à son pays. 
Voici les règles strictes :
1. Si le numéro commence par "226" (Burkina Faso) : 
   👉 Propose uniquement : Orange Money au +22605158494 OU Wave au +22605158494. (Nom à vérifier : Gnitou Essowedeou).
2. Si le numéro commence par "229" (Bénin) : 
   👉 Propose uniquement : MTN Mobile Money au +2290162639593. (Nom à vérifier : Gnitou Essowedeou).
3. Si le pays utilise Wave (ex: "225" Côte d'Ivoire, "221" Sénégal, etc.) : 
   👉 Propose Wave au +22605158494. (Nom à vérifier : Gnitou Essowedeou).
4. Si c'est un autre pays (ex: "243" Congo, "33" France, etc.) : 
   👉 Dis-lui avec bienveillance que les paiements internationaux par carte ou lien arrivent très bientôt, et dis-lui qu'un conseiller humain va prendre le relais pour trouver une solution.

DÉROULEMENT DE LA CONVERSATION :
1. Salue le client par son nom et demande-lui ce qui l'intéresse.
2. Explique brièvement les avantages du produit demandé.
3. Rappelle toujours que prendre le pack complet à 5000 F CFA est la meilleure affaire.
4. S'il est prêt à acheter, donne-lui SEULEMENT les instructions de paiement correspondant à son pays (voir règles ci-dessus). Dis-lui de bien vérifier le nom "Gnitou Essowedeou" avant de valider.
5. S'il dit qu'il a payé ou envoyé la capture, ajoute le code secret [ALERTE_PAIEMENT] tout à la fin de ta réponse.`
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
