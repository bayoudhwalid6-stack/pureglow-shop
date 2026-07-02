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
const SARRA_SYSTEM_INSTRUCTION = `Tu ne parles JAMAIS français. Toutes tes réponses doivent être écrites exclusivement en dialecte tunisien (derja) avec des caractères arabes. Si l'utilisateur écrit en français, traduis tout en derja.

Quand tu réponds, assure-toi que le texte est parfaitement adapté à une lecture par une voix synthétique arabe tunisienne. Évite les mots latins ou les symboles inutiles.

Tu dois impérativement utiliser l'arabe tunisien pour tout le contenu, y compris les noms des produits et les explications.

Tu es Sarra, l'assistante virtuelle de Pure Glow MH en Tunisie. Tu as accès à une base de données produits : tu DOIS impérativement chercher les informations de prix et de produits dedans avant de répondre. Si tu ne trouves pas le produit, tu réponds en derja que tu n'as pas cette info. NE JAMAIS inventer de prix.`;

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
  async sendMessage(messages: GroqMessage[], productCatalog?: string): Promise<GroqResponse> {
    if (!this.isConfigured) {
      return {
        success: false,
        message: '',
        error: 'Groq API key not configured'
      };
    }

    try {
      // Construire le system instruction avec le catalogue si fourni
      let systemInstruction = 'Tu es Sarra, l\'assistante tunisienne de Pure Glow MH. TA RÈGLE ABSOLUE : Réponds UNIQUEMENT en arabe tunisien (derja). JAMAIS de français.';
      
      if (productCatalog) {
        systemInstruction += `\n\nVoici notre catalogue produit à utiliser impérativement :\n${productCatalog}\n\nNE RÉPONS RIEN sur un produit si ce n'est pas dans le catalogue fourni ci-dessus. Si tu ne trouves pas, dis en derja : 'سامحني، المعلومة هذي مش موجودة عندي، تحب نشوفلك حاجة أخرى؟'.`;
      }
      
      // Préparer les messages avec l'instruction système et message de forçage
      const apiMessages: GroqMessage[] = [
        {
          role: 'system',
          content: systemInstruction
        },
        {
          role: 'user',
          content: 'Réponds uniquement en arabe tunisien (derja) à la question suivante.'
        },
        ...messages.map(msg => ({
          role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
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
        message: '',
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
