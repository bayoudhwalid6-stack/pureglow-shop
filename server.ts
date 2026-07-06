import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000; // Port backend dédié

app.use(cors({ origin: '*' }));
app.use(express.json());

// Log des requêtes entrantes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get('/api/products', (req, res) => {
  res.json([]);
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Aucun message reçu." });
    }

    const lastUserMessage = messages[messages.length - 1];
    const textToSend = lastUserMessage.text || lastUserMessage.content || "ahla";

    // Réponse mock de Selma (API Gemini modèle non disponible sur v1beta)
    const selmaResponses = [
      `Ahla ! Bienvenue chez Pure Glow MH à Mahdia ! Je suis Selma, ta conseillère. Tu as dit : "${textToSend}". Nos savons artisanaux sont parfaits pour ta peau.`,
      `Bonjour ! Je suis Selma, ta conseillère Pure Glow MH. Comment puis-je t'aider avec "${textToSend}" ? Nos savons naturels sont exceptionnels !`,
      `Ahlan bik ! C'est Selma de Pure Glow MH. Pour "${textToSend}", je te recommande nos savons à l'huile d'olive et au lait de chèvre.`
    ];
    
    const randomResponse = selmaResponses[Math.floor(Math.random() * selmaResponses.length)];

    return res.json({ text: randomResponse, reply: randomResponse, content: randomResponse });
  } catch (error) {
    console.error("Erreur backend détaillée:", error);
    return res.status(500).json({ error: "Erreur interne backend.", details: error instanceof Error ? error.message : String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Express running on http://localhost:${PORT}`);
});