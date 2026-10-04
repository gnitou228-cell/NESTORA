import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import axios from 'axios';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

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

let supabase: any = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
}

async function saveContact(phone: string, contactName: string) {
  try {
    if (supabase) {
      await supabase
        .from('whatsapp_leads')
        .upsert({ 
          phone: phone, 
          name: contactName,
          last_message_at: new Date().toISOString()
        }, { onConflict: 'phone' });
    } else {
      console.log('Supabase non configuré, impossible de sauvegarder le contact');
    }
  } catch (err) {
    console.error('Erreur lors de la sauvegarde du contact:', err);
  }
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
        
        // Sauvegarder le contact en base de données
        saveContact(from, contactName);
        
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

// Store conversation history in memory (Phone number -> Array of messages)
const conversationHistory = new Map<string, any[]>();

async function respondWithAI(phone: string, text: string, contactName: string) {
  if (!openai) {
    console.log("Clé OpenAI manquante, mode écho activé.");
    return sendWhatsAppMessage(phone, `🤖 Bonjour ${contactName}, vous avez dit: ${text}`);
  }

  // Initialiser l'historique pour ce numéro s'il n'existe pas
  if (!conversationHistory.has(phone)) {
    conversationHistory.set(phone, []);
  }

  const history = conversationHistory.get(phone)!;

  // Ajouter le message du client à l'historique
  history.push({ role: 'user', content: text });

  // Garder seulement les 10 derniers échanges pour ne pas saturer la mémoire
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es l'assistant commercial de Jeff Digital.
Ton but est de vendre nos services sur WhatsApp. Sois chaleureux, rapide, naturel.

LE CLIENT :
Nom : "${contactName}" (utilise son nom pour être poli, mais pas à chaque message).

RÈGLE D'OR CONTRE LA RÉPÉTITION (TRES IMPORTANT) :
Si le client pose une question directe (ex: "comment on paye ?", "c'est quoi le prix ?"), REPONDS LUI DIRECTEMENT.
NE TE PRÉSENTE PAS. NE DIS PAS "Bonjour je suis l'assistant digital". 
Entre directement dans le vif du sujet. Le client te connaît déjà.

RÈGLE DES PRIX :
Chaque produit/formation est à 1 300 FCFA. Ne parle JAMAIS de 1000 FCFA ou 5000 FCFA.

CATALOGUE :
- FORMATIONS : 30 Jours Réseaux Sociaux, Marketing Digital, CapCut, Premiere Pro, FL Studio.
- OUTILS : Canva Pro, CapCut Pro, Filmora, InShot Pro, Veo 3, Gemini.
- AUTRES : 160 livres numériques, 200 livres audio, 250 apps Android.
- SERVICES : Création compte TikTok monétisable, etc.

CONDUITE DE LA CONVERSATION :
1. Sois très concis (pas de longs paragraphes).
2. Si le client veut acheter, arrête les explications et donne les numéros de paiement.

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
      ...history
    ]
  });

  let reply = completion.choices[0].message.content || 'Désolé, je ne peux pas répondre pour le moment.';
  
  // Ajouter la réponse de l'IA à l'historique
  history.push({ role: 'assistant', content: reply });
  
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
