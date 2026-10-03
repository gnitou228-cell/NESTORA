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
        
        console.log(`Message reçu de ${from}: ${text}`);
        
        try {
          // Attendre la réponse de l'IA AVANT de renvoyer 200 à Facebook
          // (Sinon Vercel coupe la fonction Serverless immédiatement)
          await respondWithAI(from, text);
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

async function respondWithAI(phone: string, text: string) {
  if (!openai) {
    console.log("Clé OpenAI manquante, mode écho activé.");
    return sendWhatsAppMessage(phone, `🤖 Vous avez dit: ${text}\n\n(Configurez la clé OpenAI pour des réponses intelligentes)`);
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Tu es l'assistant virtuel de NESTORA, une plateforme immobilière innovante.
Ton but est d'accueillir les clients de manière chaleureuse, de répondre à leurs questions sur la plateforme (locations, ventes, comment publier une annonce), et de les guider vers notre site web.
Sois concis, courtois et professionnel.`
      },
      { role: 'user', content: text }
    ]
  });

  const reply = completion.choices[0].message.content || 'Désolé, je ne peux pas répondre pour le moment.';
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
