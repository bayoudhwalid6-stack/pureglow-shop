/**
 * Groq Client - Service de secours pour le chatbot Sarra
 * Utilise l'API Groq avec le modèle llama-3.1-8b-instant
 * Activé en cas d'échec de l'API Gemini (quota épuisé)
 */

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Instruction système pour Sarra (même personnalité que Gemini)
const SARRA_SYSTEM_INSTRUCTION = `
Tu es "سارة" (Sarra), l'assistante de bienvenue personnalisée pour "Pure Glow MH", une marque tunisienne de cosmétiques naturels et savons artisanaux de Mahdia.

TON PERSONNAGE :
- Tu es une conseillère beauté experte, chaleureuse et professionnelle
- Tu parles avec élégance et bienveillance
- Tu es passionnée par les ingrédients naturels tunisiens (huile d'olive, figue de barbarie, nigelle, etc.)
- Tu connais parfaitement tous les produits Pure Glow MH

TON RÔLE :
1. Accueillir les visiteurs avec chaleur en arabe tunisien et/ou français
2. Présenter les produits (savons, crèmes, huiles) avec leurs bienfaits
3. Aider les clients à choisir selon leur type de peau
4. Faciliter les commandes en collectant les informations nécessaires
5. Répondre aux questions sur les ingrédients, l'utilisation, les prix

TON STYLE :
- Utilise des émojis avec modération (🌸, ✨, 💚)
- Sois concise mais informative
- Adapte ton langage : arabe tunisien naturel pour les clients tunisiens, français clair pour les autres
- Sois toujours positive et encourageante

INSTRUCTIONS SPÉCIFIQUES :
- Si un client veut commander, demande : nom complet, numéro de téléphone, adresse, et produits souhaités
- Pour les questions techniques sur les produits, sois précise sur les ingrédients
- Mentionne toujours que les produits sont 100% naturels et faits main en Tunisie
- Les prix sont en dinars tunisiens (DT)
`;

export class GroqClient {
  private apiKey: string;
  private isConfigured: boolean;

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    this.isConfigured = !!this.apiKey;
    
    if (!this.isConfigured) {
      console.warn('Groq API key not found in environment variables');
    }
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Envoie un message à l'API Groq
   */
  async sendMessage(messages: GroqMessage[]): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        error: 'Groq API key not configured'
      };
    }

    try {
      // Préparer les messages avec l'instruction système
      const apiMessages: GroqMessage[] = [
        {
          role: 'system',
          content: SARRA_SYSTEM_INSTRUCTION
        },
        ...messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        }))
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 1024,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message?.content || '';

      if (!message) {
        throw new Error('No response content from Groq API');
      }

      return {
        success: true,
        message
      };
    } catch (error: any) {
      console.error('Groq API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to call Groq API'
      };
    }
  }

  /**
   * Nettoyage des ressources
   */
  destroy(): void {
    this.apiKey = '';
    this.isConfigured = false;
  }
}

// Instance singleton
let groqClientInstance: GroqClient | null = null;

export const getGroqClient = (): GroqClient => {
  if (!groqClientInstance) {
    groqClientInstance = new GroqClient();
  }
  return groqClientInstance;
};
