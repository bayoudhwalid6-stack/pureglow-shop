/**
 * Speech Synthesis Module (TTS - Text to Speech)
 * Utilise Web Speech API pour la synthèse vocale
 * Compatible avec tous les navigateurs modernes
 */

export interface SpeechSynthesisCallbacks {
  onStart: () => void;
  onEnd: () => void;
  onError: (error: string) => void;
  onBoundary?: (event: any) => void;
}

export class SpeechSynthesisService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;
  private callbacks: SpeechSynthesisCallbacks | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.initializeSynthesis();
  }

  /**
   * Initialise l'API de synthèse vocale
   */
  private initializeSynthesis(): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API non supportée dans ce navigateur');
      return;
    }

    this.synthesis = window.speechSynthesis;

    // Charger les voix disponibles
    this.loadVoices();

    // Écouter les changements de voix (chargement asynchrone)
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  /**
   * Charge les voix disponibles et sélectionne la meilleure voix arabe
   */
  private loadVoices(): void {
    if (!this.synthesis) return;

    this.voices = this.synthesis.getVoices();
    console.log(`Voix disponibles: ${this.voices.length}`);

    // Priorité: Voix arabe -> Voix française avec fallback
    const arabicVoice = this.voices.find(voice => 
      voice.lang.startsWith('ar') || voice.lang.includes('ar')
    );

    const frenchVoice = this.voices.find(voice => 
      voice.lang.startsWith('fr') || voice.lang.includes('fr')
    );

    this.selectedVoice = arabicVoice || frenchVoice || this.voices[0] || null;

    if (this.selectedVoice) {
      console.log(`Voix sélectionnée: ${this.selectedVoice.name} (${this.selectedVoice.lang})`);
    }
  }

  /**
   * Nettoie le texte pour la synthèse vocale
   * Supprime les caractères Markdown et autres éléments non vocaux
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // Supprimer les caractères Markdown
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **text**
      .replace(/\*(.*?)\*/g, '$1')     // Italic *text*
      .replace(/_(.*?)_/g, '$1')       // Italic _text_
      .replace(/~~(.*?)~~/g, '$1')     // Strikethrough ~~text~~
      .replace(/`(.*?)`/g, '$1')       // Inline code `text`
      .replace(/```[\s\S]*?```/g, '')  // Code blocks
      // Supprimer les caractères spéciaux
      .replace(/[#*_~`]/g, '')
      // Supprimer les émojis (optionnel, selon préférence)
      .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]/gu, '')
      // Nettoyer les espaces multiples
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Configure l'utterance avec les paramètres optimaux
   */
  private configureUtterance(text: string): SpeechSynthesisUtterance {
    const cleanedText = this.cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Configuration de la voix
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Configuration de la langue (arabe tunisien ou français)
    utterance.lang = this.selectedVoice?.lang || 'ar-TN';

    // Paramètres de parole optimisés pour une conversation naturelle
    utterance.rate = 0.9;        // Vitesse légèrement réduite pour clarté
    utterance.pitch = 1.0;       // Pitch normal
    utterance.volume = 1.0;      // Volume maximum

    // Gestionnaires d'événements
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (this.callbacks?.onStart) {
        this.callbacks.onStart();
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (this.callbacks?.onEnd) {
        this.callbacks.onEnd();
      }
    };

    utterance.onerror = (event: any) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      
      let errorMessage = 'Erreur de synthèse vocale';
      
      switch (event.error) {
        case 'canceled':
          errorMessage = 'Synthèse annulée';
          break;
        case 'interrupted':
          errorMessage = 'Synthèse interrompue';
          break;
        case 'synthesis-failed':
          errorMessage = 'Échec de la synthèse';
          break;
        case 'voice-unavailable':
          errorMessage = 'Voix non disponible';
          break;
        default:
          errorMessage = `Erreur: ${event.error}`;
      }

      if (this.callbacks?.onError) {
        this.callbacks.onError(errorMessage);
      }
    };

    utterance.onboundary = (event: any) => {
      if (this.callbacks?.onBoundary) {
        this.callbacks.onBoundary(event);
      }
    };

    return utterance;
  }

  /**
   * Démarre la synthèse vocale
   */
  public speak(text: string, callbacks: SpeechSynthesisCallbacks): boolean {
    if (!this.synthesis) {
      callbacks.onError('Speech Synthesis non supportée');
      return false;
    }

    // Arrêter toute synthèse en cours
    this.stop();

    this.callbacks = callbacks;
    this.currentUtterance = this.configureUtterance(text);

    try {
      this.synthesis.speak(this.currentUtterance);
      return true;
    } catch (error) {
      console.error('Erreur démarrage synthèse:', error);
      callbacks.onError('Impossible de démarrer la synthèse vocale');
      return false;
    }
  }

  /**
   * Arrête la synthèse vocale
   */
  public stop(): void {
    if (this.synthesis && this.isSpeaking) {
      try {
        this.synthesis.cancel();
        this.isSpeaking = false;
        this.currentUtterance = null;
      } catch (error: any) {
        console.error('Erreur arrêt synthèse:', error);
      }
    }
  }

  /**
   * Met en pause la synthèse vocale
   */
  public pause(): void {
    if (this.synthesis && this.isSpeaking) {
      try {
        this.synthesis.pause();
      } catch (error: any) {
        console.error('Erreur pause synthèse:', error);
      }
    }
  }

  /**
   * Reprend la synthèse vocale
   */
  public resume(): void {
    if (this.synthesis) {
      try {
        this.synthesis.resume();
      } catch (error: any) {
        console.error('Erreur reprise synthèse:', error);
      }
    }
  }

  /**
   * Vérifie si le navigateur supporte la synthèse vocale
   */
  public static isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Change la voix de synthèse
   */
  public setVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  /**
   * Retourne la liste des voix disponibles
   */
  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  /**
   * Change la vitesse de parole (0.1 à 10)
   */
  public setRate(rate: number): void {
    if (this.currentUtterance) {
      this.currentUtterance.rate = Math.max(0.1, Math.min(10, rate));
    }
  }

  /**
   * Change le pitch (0 à 2)
   */
  public setPitch(pitch: number): void {
    if (this.currentUtterance) {
      this.currentUtterance.pitch = Math.max(0, Math.min(2, pitch));
    }
  }

  /**
   * Vérifie si une synthèse est en cours
   */
  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  /**
   * Nettoyage des ressources
   */
  public destroy(): void {
    this.stop();
    this.callbacks = null;
    this.synthesis = null;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.voices = [];
  }
}

// Instance singleton pour l'application
let speechSynthesisInstance: SpeechSynthesisService | null = null;

export const getSpeechSynthesis = (): SpeechSynthesisService => {
  if (!speechSynthesisInstance) {
    speechSynthesisInstance = new SpeechSynthesisService();
  }
  return speechSynthesisInstance;
};
