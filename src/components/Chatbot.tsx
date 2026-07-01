import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, MapPin, Phone, HelpCircle, ShoppingBag, BadgeAlert, Database, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSpeechRecognition, SpeechRecognitionService } from '../lib/speechRecognition';
import { getSpeechSynthesis, SpeechSynthesisService } from '../lib/speechSynthesis';
import { getGeminiClient, GeminiMessage } from '../lib/geminiClient';
import { getGroqClient, GroqMessage } from '../lib/groqClient';
import { isSupabaseConfigured } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isNightMode?: boolean;
}

export default function Chatbot({ isNightMode = false }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [configStatus, setConfigStatus] = useState({ supabase: false, gemini: false });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice states
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [lastReadMessageId, setLastReadMessageId] = useState<string | null>(null);
  
  // Service instances
  const speechRecognitionRef = useRef<SpeechRecognitionService | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisService | null>(null);
  const lastSendTimeRef = useRef<number>(0);

  // Initialize voice services
  useEffect(() => {
    if (SpeechRecognitionService.isSupported()) {
      speechRecognitionRef.current = getSpeechRecognition();
    }
    if (SpeechSynthesisService.isSupported()) {
      speechSynthesisRef.current = getSpeechSynthesis();
    }
    
    return () => {
      speechRecognitionRef.current?.destroy();
      speechSynthesisRef.current?.destroy();
    };
  }, []);

  // Load configuration status from client-side
  useEffect(() => {
    const geminiClient = getGeminiClient();
    setConfigStatus({
      supabase: isSupabaseConfigured,
      gemini: geminiClient.isReady()
    });
  }, []);

  // Initialize with welcome message if empty
  useEffect(() => {
    const saved = localStorage.getItem('biocosmetique_chat_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
        return;
      } catch (e) {
        console.error(e);
      }
    }    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "أهلاً بكِ في **بيور غلو MH** بالمهدية 🌸\n\nأنا **سارة**، مستشارتكِ المخصصة للعناية الطبيعية بالبشرة. نقوم بصناعة أرقى الصابون الطبيعي المصنوع على البارد والكريمات المرطبة الفاخرة يدوياً بكل حب، باستخدام أنقى الزيوت والمستخلصات التونسية (كزيت التين الشوكي، زيت الزيتون البكر، وعطر الياسمين).\n\nكيف يمكنني مساعدتكِ اليوم للعناية بجمال بشرتكِ؟ يمكنكِ الاستفسار عن فوائد منتجاتنا أو طلب الشراء مباشرة من هنا! ✨",
        timestamp: new Date()
      }
    ]);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('biocosmetique_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Register a global event listener for catalog clicks and order tracking queries
  useEffect(() => {
    const handleOrderEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ productNom?: string; customPrompt?: string }>;
      const pNom = customEvent.detail?.productNom;
      const customPrompt = customEvent.detail?.customPrompt;
      
      if (customPrompt) {
        setIsOpen(true);
        setTimeout(() => {
          setInput(customPrompt);
        }, 100);
      } else if (pNom) {
        setIsOpen(true);
        // Prefill the input bar with the product order request
        setTimeout(() => {
          setInput(`أهلاً سارة! أرغب في طلب شراء منتج: "${pNom}"`);
        }, 100);
      }
    };
    window.addEventListener('chat-order', handleOrderEvent);
    return () => window.removeEventListener('chat-order', handleOrderEvent);
  }, []);

  const handleSend = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || isLoading) return;

    // Debouncing: attendre 1 seconde entre les envois pour éviter la surconsommation de quota
    const now = Date.now();
    const timeSinceLastSend = now - lastSendTimeRef.current;
    const debounceDelay = 1000; // 1 seconde

    if (timeSinceLastSend < debounceDelay) {
      const remainingTime = debounceDelay - timeSinceLastSend;
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }

    if (!textToSend) setInput('');
    lastSendTimeRef.current = Date.now();

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setIsGenerating(true);

    try {
      const geminiClient = getGeminiClient();
      
      // Convertir les messages au format Gemini
      const geminiMessages: GeminiMessage[] = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await geminiClient.sendMessage(geminiMessages);
      
      if (response.success) {
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: response.message,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(response.error || "Erreur lors de la réponse");
      }
    } catch (err: any) {
      console.error('Gemini error:', err);
      
      // Vérifier si c'est une erreur de quota (429)
      const isQuotaError = err?.message?.includes('429') || 
                          err?.message?.includes('quota') || 
                          err?.message?.includes('Quota') ||
                          err?.status === 429;
      
      if (isQuotaError) {
        // Failover vers Groq
        console.log('Gemini quota exceeded, trying Groq failover...');
        try {
          const groqClient = getGroqClient();
          
          // Convertir les messages au format Groq
          const groqMessages: GroqMessage[] = [...messages, userMsg].map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }));

          const groqResponse = await groqClient.sendMessage(groqMessages);
          
          if (groqResponse.success) {
            setMessages(prev => [...prev, {
              id: Math.random().toString(),
              role: 'assistant',
              content: groqResponse.message,
              timestamp: new Date()
            }]);
          } else {
            throw new Error(groqResponse.error || "Groq failed");
          }
        } catch (groqErr: any) {
          console.error('Groq failover error:', groqErr);
          // Les deux ont échoué - message de secours
          const fallbackMessage = "عذراً! أنا في pause technique لبضع لحظات. يمكنكِ الاستمرار في تصفح الموقع، سأعود قريباً جداً! 🌸\n\nDésolé, je suis en pause technique pour quelques instants. Vous pouvez continuer à naviguer sur le site, je serai de retour très bientôt !";
          
          setMessages(prev => [...prev, {
            id: Math.random().toString(),
            role: 'assistant',
            content: fallbackMessage,
            timestamp: new Date()
          }]);
        }
      } else {
        // Erreur autre que quota - message d'erreur standard
        const fallbackMessage = "عذراً! أواجه مشكلة مؤقتة في الاتصال بالذكاء الاصطناعي. يرجى التأكد من إعداد مفتاح GEMINI_API_KEY بشكل صحيح أو المحاولة مجدداً بعد قليل. أنا في خدمتكم دائماً!";
        
        setMessages(prev => [...prev, {
          id: Math.random().toString(),
          role: 'assistant',
          content: fallbackMessage,
          timestamp: new Date()
        }]);
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSend(q);
  };

  // Voice control functions
  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    setVoiceError(null);
  };

  const startListening = () => {
    if (!speechRecognitionRef.current) {
      setVoiceError('Reconnaissance vocale non supportée');
      return;
    }

    // Vérification de la disponibilité de l'API avant tout
    if (!SpeechRecognitionService.isSupported()) {
      setVoiceError('Reconnaissance vocale non supportée sur ce navigateur');
      return;
    }

    // Interruption de la voix en cours si Sarra parle
    window.speechSynthesis.cancel();

    // Appel SYNCHRONE de start() directement dans le handler de clic
    // C'est critique pour mobile : les navigateurs mobiles bloquent l'accès au micro
    // si start() n'est pas appelé de manière synchrone suite à un geste utilisateur
    const success = speechRecognitionRef.current.start({
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setInput(transcript);
          setInterimTranscript('');
          // Auto-send après un court délai pour une conversation naturelle
          setTimeout(() => handleSend(transcript), 500);
        } else {
          setInterimTranscript(transcript);
        }
      },
      onError: (error) => {
        setVoiceError(error);
        setIsListening(false);
      },
      onStart: () => {
        setIsListening(true);
        setVoiceError(null);
        setInterimTranscript('');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (!success) {
      setVoiceError('Impossible de démarrer le microphone');
    }
  };

  const stopListening = () => {
    speechRecognitionRef.current?.stop();
    setIsListening(false);
  };

  const speakMessage = (text: string) => {
    if (!voiceEnabled || !speechSynthesisRef.current) return;

    speechSynthesisRef.current.speak(text, {
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    });
  };

  const stopSpeaking = () => {
    speechSynthesisRef.current?.stop();
    setIsSpeaking(false);
  };

  // Auto-speak assistant messages when voice is enabled
  useEffect(() => {
    if (voiceEnabled && !isSpeaking && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      // Only speak if it's an assistant message and hasn't been read yet
      if (lastMessage?.role === 'assistant' && lastMessage.id !== lastReadMessageId) {
        setLastReadMessageId(lastMessage.id);
        speakMessage(lastMessage.content);
      }
    }
  }, [messages, voiceEnabled, isSpeaking, lastReadMessageId]);

  const quickQuestions = [
    "ما هي منتجاتكم من الصابون والكريمات؟",
    "كيف يمكنني تقديم طلب شراء؟",
    "ما هي فوائد زيت التين الشوكي؟",
    "كم تبلغ تكلفة التوصيل في تونس؟"
  ];

  const chatBgMain = isNightMode ? 'bg-[#141E15]' : 'bg-[#F9F7F2]';
  const chatBgWhite = isNightMode ? 'bg-[#1D2A1E]' : 'bg-white';
  const chatBgLight = isNightMode ? 'bg-[#19241A]' : 'bg-[#FAF9F5]';
  const chatTextMain = isNightMode ? 'text-[#FAF9F5]' : 'text-[#2C3E2E]';
  const chatTextMuted = isNightMode ? 'text-[#A0A49B]' : 'text-[#5A5A40]';
  const chatBorderMain = isNightMode ? 'border-[#FAF9F5]/10' : 'border-[#2C3E2E]/15';

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          id="chat-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full bg-[#2C3E2E] text-[#F9F7F2] shadow-2xl hover:bg-[#C18D5D] focus:outline-none transition-colors border border-[#C18D5D]/20 cursor-pointer"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          
          {/* Notification Badge if not open */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C18D5D] opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-[#C18D5D] text-[9px] font-bold text-white items-center justify-center">1</span>
            </span>
          )}
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chat-window-panel"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 flex max-h-[80dvh] h-[600px] w-[calc(100vw-2rem)] sm:w-[400px] sm:max-h-[700px] flex-col overflow-hidden rounded-xl ${chatBgMain} shadow-2xl border ${chatBorderMain} transition-colors duration-300`}
          >
            {/* Header */}
            <div className="bg-[#2C3E2E] p-4 text-[#F9F7F2] border-b border-[#C18D5D]/20" dir="rtl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="relative">
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-[#C18D5D]/35 bg-[#FAF9F5] flex items-center justify-center text-[#2C3E2E] font-serif italic text-lg font-bold">
                      س
                    </div>
                    <span className="absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-[#2C3E2E] bg-[#C18D5D]" />
                  </div>
                  <div className="text-right">
                    <h3 className="font-display text-sm font-bold leading-tight flex items-center text-[#F9F7F2]">
                      سارة — بيور غلو MH
                      <Sparkles className="h-3.5 w-3.5 mr-1 text-[#C18D5D] animate-pulse" />
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-[#E8E4DB] font-semibold">مستشارة التجميل الذكية 🌸</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2.5 min-h-[44px] min-w-[44px] text-[#F9F7F2]/80 hover:bg-white/10 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status Banner */}
              <div className="mt-3 flex items-center justify-between rounded-sm bg-[#FAF9F5]/10 px-2.5 py-1 text-[9px] text-[#E8E4DB] uppercase tracking-wider">
                <div className="flex items-center space-x-1.5 space-x-reverse">
                  <Database className="h-3 w-3 text-[#C18D5D]" />
                  <span>قاعدة البيانات: {configStatus.supabase ? <span className="text-[#F9F7F2] font-semibold">سوبابيس نشط</span> : <span className="text-amber-300">محلية</span>}</span>
                </div>
                <div className="flex items-center space-x-1.5 space-x-reverse">
                  <Sparkles className="h-3 w-3 text-[#C18D5D]" />
                  <span>الذكاء الاصطناعي: {configStatus.gemini ? <span className="text-[#F9F7F2] font-semibold">جميني نشط</span> : <span className="text-amber-300">محاكاة</span>}</span>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className={`flex-1 overflow-y-auto ${chatBgMain} p-4 space-y-4 transition-colors duration-300`} dir="rtl">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-sm px-4 py-3 text-sm shadow-xs ${
                      msg.role === 'user'
                        ? 'bg-[#C18D5D] text-white rounded-bl-none'
                        : `${chatBgWhite} ${chatTextMain} rounded-br-none border ${chatBorderMain}`
                    }`}
                  >
                    {/* Render basic Markdown lines with bold bold/italic support */}
                    <div className="space-y-1.5 whitespace-pre-line leading-relaxed text-right">
                      {msg.content.split('\n\n').map((paragraph, idx) => {
                        // Very basic markdown parser for strong texts **word**
                        const parts = paragraph.split('**');
                        return (
                          <p key={idx}>
                            {parts.map((part, i) => (
                              i % 2 === 1 ? <strong key={i} className="font-semibold text-[#2C3E2E] bg-amber-100/40 px-1 rounded">{part}</strong> : part
                            ))}
                          </p>
                        );
                      })}
                    </div>
                    <span
                      className={`block mt-1.5 text-[9px] text-right ${
                        msg.role === 'user' ? 'text-white/80' : chatTextMuted
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {/* Thinking Indicator - Sarra réfléchit */}
              {isGenerating && (
                <div className="flex justify-start" dir="rtl">
                  <div className={`${chatBgWhite} ${chatTextMain} rounded-sm rounded-br-none border ${chatBorderMain} px-4 py-3 shadow-xs`}>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C18D5D]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C18D5D] delay-100" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#C18D5D] delay-200" />
                      </div>
                      <span className="text-xs text-[#C18D5D] font-medium animate-pulse">
                        سارة réfléchit...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Helper Suggestions */}
            {messages.length === 1 && (
              <div className={`${chatBgLight} border-t ${chatBorderMain} p-2 transition-colors duration-300`} dir="rtl">
                <p className={`text-[10px] uppercase tracking-wider ${chatTextMuted} px-2 pb-1.5 font-bold flex items-center gap-1.5`}>
                  <HelpCircle className="h-3.5 w-3.5 text-[#C18D5D]" />
                  <span>اقتراحات للمحادثة المباشرة :</span>
                </p>
                <div className="flex flex-wrap gap-1.5 px-1 pb-1">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q)}
                      className={`rounded-sm ${chatBgWhite} px-4 py-2.5 min-h-[44px] text-xs ${chatTextMain} border ${chatBorderMain} hover:border-[#C18D5D] hover:bg-[#C18D5D]/5 transition-colors text-right cursor-pointer`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className={`border-t ${chatBorderMain} ${chatBgWhite} p-3.5 transition-colors duration-300`} dir="rtl">
              {/* Voice Error Display */}
              {voiceError && (
                <div className="mb-2 px-2 py-1 bg-red-100 border border-red-300 rounded-sm text-red-700 text-xs flex items-center justify-between">
                  <span>{voiceError}</span>
                  <button onClick={() => setVoiceError(null)} className="text-red-700 hover:text-red-900">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Interim Transcript Display */}
              {interimTranscript && (
                <div className="mb-2 px-3 py-1.5 bg-[#C18D5D]/10 border border-[#C18D5D]/30 rounded-sm text-xs text-[#2C3E2E] italic">
                  <span className="text-[#C18D5D]">جاري الاستماع: </span>
                  {interimTranscript}
                </div>
              )}

              <div className="flex items-center space-x-2 space-x-reverse">
                {/* Voice Toggle Button */}
                <button
                  onClick={toggleVoice}
                  className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border transition-colors cursor-pointer ${
                    voiceEnabled 
                      ? 'bg-[#C18D5D] text-white border-[#C18D5D]' 
                      : `${chatBgLight} ${chatTextMain} border ${chatBorderMain} hover:border-[#C18D5D]`
                  }`}
                  title={voiceEnabled ? "Désactiver le mode vocal" : "Activer le mode vocal"}
                >
                  {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>

                {/* Microphone Button */}
                {voiceEnabled && (
                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm border transition-colors cursor-pointer ${
                      isListening 
                        ? 'bg-red-500 text-white border-red-500 animate-pulse' 
                        : `${chatBgLight} ${chatTextMain} border ${chatBorderMain} hover:border-[#C18D5D]`
                    }`}
                    title={isListening ? "Arrêter l'écoute" : "Démarrer l'écoute"}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                )}

                {/* Stop Speaking Button */}
                {voiceEnabled && isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm bg-amber-500 text-white border border-amber-500 hover:bg-amber-600 transition-colors cursor-pointer"
                    title="Arrêter la parole"
                  >
                    <VolumeX className="h-5 w-5" />
                  </button>
                )}

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={voiceEnabled ? "تحدثي أو اكتبي رسالتكِ هنا..." : "اكتبي رسالتكِ هنا للمستشارة..."}
                  className={`flex-1 rounded-sm border ${isNightMode ? 'border-[#FAF9F5]/25 bg-[#141E15]' : 'border-[#2C3E2E]/15 bg-[#F9F7F2]/40'} px-4 py-3 min-h-[44px] text-sm ${chatTextMain} placeholder-[#5A5A40]/60 focus:border-[#C18D5D] focus:bg-${isNightMode ? '[#141E15]' : 'white'} focus:outline-none focus:ring-0 text-right`}
                  disabled={isListening}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading || isListening}
                  className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-sm bg-[#2C3E2E] text-white shadow hover:bg-[#C18D5D] disabled:bg-slate-200 disabled:text-slate-400 transition-colors cursor-pointer"
                >
                  <Send className="h-5 w-5 transform rotate-180" />
                </button>
              </div>

              {/* Voice Status Indicator */}
              {voiceEnabled && (
                <div className="mt-2 flex items-center justify-center space-x-2 space-x-reverse text-[9px] uppercase tracking-wider">
                  {isListening && (
                    <span className="flex items-center text-red-500 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-1"></span>
                      جاري الاستماع
                    </span>
                  )}
                  {isSpeaking && (
                    <span className="flex items-center text-[#C18D5D] font-semibold">
                      <span className="h-2 w-2 rounded-full bg-[#C18D5D] animate-pulse mr-1"></span>
                      جاري الحديث
                    </span>
                  )}
                  {!isListening && !isSpeaking && (
                    <span className={`${chatTextMuted} font-semibold`}>
                      الوضع الصوتي نشط
                    </span>
                  )}
                </div>
              )}

              {/* Secure Info Footnote */}
              <p className={`text-[9px] uppercase tracking-wider text-center ${chatTextMuted} mt-2 flex items-center justify-center space-x-1 space-x-reverse font-semibold`}>
                <ShoppingBag className="h-3 w-3 text-[#C18D5D]" />
                <span>الدفع نقداً عند الاستلام في كامل ولايات تونس 🚚</span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
