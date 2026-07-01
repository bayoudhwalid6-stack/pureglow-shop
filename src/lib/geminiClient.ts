/**
 * Gemini AI Client - Client-Side Integration
 * Utilise le SDK officiel @google/genai pour communiquer avec Google Gemini
 * Configuration 100% client-side avec Vite environment variables
 */

import { GoogleGenAI } from '@google/genai';

// Configuration de la persona Sarra
const SARRA_SYSTEM_INSTRUCTION = `
Tu es Sarra, une conseillère en beauté chaleureuse, professionnelle et bilingue spécialisée dans les soins naturels pour Pure Glow MH.

TA PERSONNALITÉ :
- Chaleureuse et accueillante comme une amie de confiance
- Professionnelle et experte en cosmétiques naturels tunisiens
- Bilingue : maîtrise parfaite de l'arabe tunisien (ar-TN) et du français
- Passionnée par les ingrédients naturels tunisiens (huile d'argan, figue de barbarie, jasmin, etc.)

TON RÔLE :
- Conseiller les clientes sur les produits Pure Glow MH adaptés à leur type de peau
- Expliquer les bienfaits des ingrédients naturels utilisés
- Aider à passer des commandes de manière simple et naturelle
- Répondre aux questions sur la livraison, le paiement et les modes d'utilisation
- Parler naturellement en arabe tunisien ou français selon la préférence de la cliente

INSTRUCTIONS SPÉCIFIQUES :
- Toujours être empathique et encourageante
- Utiliser un langage simple et accessible
- Ne jamais inventer de produits ou de prix non existants
- Pour les commandes, demander : nom complet, numéro de téléphone, adresse de livraison
- Les produits coûtent 15.000 DT chacun
- Livraison gratuite pour les commandes > 60 DT
- Paiement à la livraison uniquement
- Livraison dans toute la Tunisie

FORMAT DE RÉPONSE :
- Réponds dans la même langue que la cliente (arabe ou français)
- Utilise des émojis avec modération pour rendre la conversation chaleureuse
- Sois concise mais complète
- Pour les commandes, confirme chaque information reçue
`;

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  success: boolean;
  message: string;
  error?: string;
}

class GeminiClient {
  private client: GoogleGenAI | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('Gemini API key not found in environment variables');
      this.isConfigured = false;
      return;
    }

    try {
      this.client = new GoogleGenAI({ apiKey });
      this.isConfigured = true;
      console.log('Gemini client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini client:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Envoie un message à Gemini et obtient une réponse
   */
  async sendMessage(messages: GeminiMessage[]): Promise<GeminiResponse> {
    if (!this.isConfigured || !this.client) {
      return {
        success: false,
        message: '',
        error: 'Gemini non configuré. Veuillez définir VITE_GEMINI_API_KEY.'
      };
    }

    try {
      // Convertir les messages au format attendu par Gemini
      const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Utiliser la nouvelle API generateContent
      const result = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: SARRA_SYSTEM_INSTRUCTION
        }
      });

      const text = result.text;

      return {
        success: true,
        message: text
      };
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Gestion des erreurs spécifiques
      if (error.status === 401) {
        return {
          success: false,
          message: '',
          error: 'Clé API Gemini invalide.'
        };
      }
      
      if (error.status === 429) {
        return {
          success: false,
          message: '',
          error: 'Limite de quota Gemini dépassée. Réessayez plus tard.'
        };
      }

      return {
        success: false,
        message: '',
        error: error.message || 'Erreur lors de la communication avec Gemini.'
      };
    }
  }

  /**
   * Vérifie si Gemini est correctement configuré
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Nettoyage des ressources
   */
  destroy(): void {
    this.client = null;
    this.isConfigured = false;
  }
}

// Instance singleton
let geminiClientInstance: GeminiClient | null = null;

export const getGeminiClient = (): GeminiClient => {
  if (!geminiClientInstance) {
    geminiClientInstance = new GeminiClient();
  }
  return geminiClientInstance;
};
