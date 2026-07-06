import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Message } from "../types";
import logoImage from "../assets/images/pure_glow_logo_1782547156728.jpg";

interface ChatBotProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

const SUGGESTED_PROMPTS = [
  "Quel savon conseiller pour peau sèche ?",
  "Quels sont les bienfaits de la figue de barbarie ?",
  "Proposez-vous la livraison gratuite ?",
  "Comment suivre ma commande ?"
];

export default function ChatBot({
  isOpen,
  onClose,
  onOpen,
}: ChatBotProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const activeIsOpen = isOpen !== undefined ? isOpen : localIsOpen;

  const handleOpen = () => {
    if (onOpen) onOpen();
    else setLocalIsOpen(true);
  };

  const handleClose = () => {
    if (onClose) onClose();
    else setLocalIsOpen(false);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "selma",
      text: "Marhaban ! Je suis **Selma**, votre conseillère en soins naturels de Pure Glow MH de Mahdia. 🌿\n\nJe suis ravie de vous guider pour trouver la routine parfaite pour votre peau. Posez-moi vos questions !",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Call server API instead of direct Gemini call to avoid client-side SDK issues
      const messagesToSend = messages.filter(m => m.id !== "welcome").map(m => ({
        sender: m.sender,
        text: m.text
      }));
      
      // Add current user message to the array
      messagesToSend.push({
        sender: "user",
        text: textToSend
      });

      console.log("Payload envoyé au serveur:", JSON.stringify({ messages: messagesToSend }, null, 2));

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToSend
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Extraire la réponse avec plusieurs variantes possibles pour compatibilité
      const responseText = data.text || data.reply || data.message || data.content || "";

      if (!responseText) {
        console.error("Réponse vide du serveur:", data);
        throw new Error("Réponse vide reçue du serveur");
      }

      const selmaMessage: Message = {
        id: `selma-${Date.now()}`,
        sender: "selma",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, selmaMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Determine error type for appropriate fallback message
      let fallbackText = "Désolée, j'ai une petite baisse d'énergie à l'atelier... 🌿 Mais sachez que notre savon à l'olive pur et notre huile de pépins de figue de barbarie restent d'excellents choix universels pour raviver votre teint !";
      
      if (error instanceof Error && error.message === "API_KEY_MISSING") {
        fallbackText = "Désolée, le service de chat est temporairement indisponible. 🌿 N'hésitez pas à nous contacter directement pour vos questions sur nos savons naturels de Mahdia !";
      }
      
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "selma",
        text: fallbackText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom chat-order event listener for product commands
  useEffect(() => {
    const handleChatOrder = (e: Event) => {
      const customEvent = e as CustomEvent<{ productNom?: string; customPrompt?: string }>;
      const productNom = customEvent.detail?.productNom;
      const customPrompt = customEvent.detail?.customPrompt;

      handleOpen();

      if (customPrompt) {
        handleSendMessage(customPrompt);
      } else if (productNom) {
        handleSendMessage(`Bonjour Selma, je souhaite commander le produit : ${productNom}`);
      }
    };

    window.addEventListener("chat-order", handleChatOrder);
    return () => {
      window.removeEventListener("chat-order", handleChatOrder);
    };
  }, [onOpen, messages]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Drawer */}
      {activeIsOpen ? (
        <div className="bg-white rounded-3xl w-80 sm:w-96 h-[500px] shadow-2xl border border-brand-accent/20 flex flex-col justify-between overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-brand-primary p-4 text-white flex items-center justify-between border-b border-brand-accent/15">
            <div className="flex items-center gap-2.5">
              {/* Avatar circular frame */}
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 flex items-center justify-center font-bold text-sm tracking-wider">
                <img
                  src={logoImage}
                  alt="Pure Glow MH Logo"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm leading-tight flex items-center gap-1">
                  Selma — Pure Glow
                  <Sparkles size={12} className="text-brand-accent animate-pulse" />
                </h3>
                <span className="text-[10px] text-brand-cream/80 block">Conseillère en cosmétique naturelle</span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer focus:outline-none"
              aria-label="Fermer le tchat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-cream/35">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-brand-primary text-white rounded-tr-none font-medium"
                      : "bg-white text-brand-dark rounded-tl-none border border-brand-accent/10"
                  }`}
                >
                  {/* Primitive Markdown-like formatting helper */}
                  {m.text.split("\n\n").map((para, i) => {
                    // Check for bold double asterisks **
                    const formattedText = para.split("**").map((chunk, j) => {
                      if (j % 2 === 1) {
                        return <strong key={j} className="font-bold text-brand-primary">{chunk}</strong>;
                      }
                      return chunk;
                    });
                    return (
                      <p key={i} className={i > 0 ? "mt-2" : ""}>
                        {formattedText}
                      </p>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Simulated typing spinner */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-brand-accent/10 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-brand-cream/10 border-t border-brand-cream">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1.5">Suggestions :</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p)}
                    className="text-[11px] bg-white border border-brand-accent/30 text-brand-dark hover:border-brand-primary hover:text-brand-primary px-2.5 py-1 rounded-full shadow-xs transition-colors text-left cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Panel */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border-t border-brand-cream bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-brand-cream border border-brand-accent/30 rounded-full px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-brand-primary"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full transition-all disabled:opacity-30 disabled:hover:bg-brand-primary cursor-pointer focus:outline-none flex items-center justify-center"
              aria-label="Envoyer"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* Circular Floating Bubble */
        <button
          onClick={handleOpen}
          className="p-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full shadow-2xl hover:shadow-brand-primary/20 hover:scale-105 transition-all duration-300 focus:outline-none flex items-center justify-center cursor-pointer group"
          title="Parler à Selma, notre conseillère IA"
        >
          <MessageCircle size={26} className="group-hover:rotate-6 transition-transform" />
          {/* Pulsing small notification dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-accent border-2 border-white rounded-full" />
        </button>
      )}
    </div>
  );
}
