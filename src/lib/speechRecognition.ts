/**
 * Speech Recognition Module (STT - Speech to Text)
 * Utilise Web Speech API pour la reconnaissance vocale
 * Compatible avec Chrome, Edge, Safari (partiel)
 */

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
}

export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private callbacks: SpeechRecognitionCallbacks | null = null;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  constructor() {
    this.initializeRecognition();
  }

  /**
   * Initialise l'API de reconnaissance vocale avec fallbacks
   */
  private initializeRecognition(): void {
    // Vérification de la compatibilité du navigateur
    const SpeechRecognitionAPI = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn('Speech Recognition API non supportée dans ce navigateur');
      return;
    }

    try {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false; // Une phrase à la fois pour plus de précision
      this.recognition.interimResults = true; // Résultats intermédiaires pour feedback visuel
      this.recognition.lang = 'ar-TN'; // Arabe tunisien par défaut
      this.recognition.maxAlternatives = 1;

      this.setupEventHandlers();
    } catch (error) {
      console.error('Erreur d\'initialisation Speech Recognition:', error);
    }
  }

  /**
   * Configure les gestionnaires d'événements
   */
  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;
      const isFinal = lastResult.isFinal;

      if (this.callbacks?.onResult) {
        this.callbacks.onResult(transcript, isFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech Recognition error:', event.error);
      
      let errorMessage = 'Erreur de reconnaissance vocale';
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'Aucune parole détectée';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone non disponible';
          break;
        case 'not-allowed':
          errorMessage = 'Permission microphone refusée';
          break;
        case 'network':
          errorMessage = 'Erreur réseau';
          break;
        case 'aborted':
          errorMessage = 'Reconnaissance interrompue';
          break;
        default:
          errorMessage = `Erreur: ${event.error}`;
      }

      if (this.callbacks?.onError) {
        this.callbacks.onError(errorMessage);
      }

      // Auto-rétry pour certaines erreurs
      if (['no-speech', 'network'].includes(event.error) && this.retryCount < this.maxRetries && this.callbacks) {
        this.retryCount++;
        setTimeout(() => this.start(this.callbacks), 500);
      }
    };

    this.recognition.onstart = () => {
      this.isListening = true;
      this.retryCount = 0;
      if (this.callbacks?.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks?.onEnd) {
        this.callbacks.onEnd();
      }
    };
  }

  /**
   * Démarre la reconnaissance vocale
   */
  public start(callbacks: SpeechRecognitionCallbacks): boolean {
    if (!this.recognition) {
      callbacks.onError('Speech Recognition non supportée');
      return false;
    }

    if (this.isListening) {
      this.stop();
    }

    this.callbacks = callbacks;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Erreur démarrage reconnaissance:', error);
      callbacks.onError('Impossible de démarrer le microphone');
      return false;
    }
  }

  /**
   * Arrête la reconnaissance vocale
   */
  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (error: any) {
        console.error('Erreur arrêt reconnaissance:', error);
      }
    }
  }

  /**
   * Vérifie si le navigateur supporte la reconnaissance vocale
   */
  public static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Change la langue de reconnaissance
   */
  public setLanguage(lang: string): void {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  /**
   * Nettoyage des ressources
   */
  public destroy(): void {
    this.stop();
    this.callbacks = null;
    this.recognition = null;
  }
}

// Instance singleton pour l'application
let speechRecognitionInstance: SpeechRecognitionService | null = null;

export const getSpeechRecognition = (): SpeechRecognitionService => {
  if (!speechRecognitionInstance) {
    speechRecognitionInstance = new SpeechRecognitionService();
  }
  return speechRecognitionInstance;
};
