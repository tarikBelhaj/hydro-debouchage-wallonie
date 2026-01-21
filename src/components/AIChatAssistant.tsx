import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageCircle, X, Send, Bot, Phone, Loader2, ChevronRight } from 'lucide-react';
import { ChatMessage, ChatSender } from '../types';
import { COMPANY_PHONE } from '../constants';

interface AIChatAssistantProps {
  currentCity: string;
  agentName?: string;
}

// Chips optimisés pour catégoriser immédiatement le besoin
const QUICK_REPLIES = [
  "🚨 URGENCE : Tout est bouché",
  "🚿 Douche / Baignoire qui refoule",
  "🚽 WC Bouché",
  "🛠️ Entretien / Curage",
  "🆕 Nouvelle Installation"
];

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ currentCity, agentName = 'Max' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: `Bonjour ! Je suis ${agentName} de ${currentCity}. C'est pour une urgence (bouchon), un entretien ou une installation ?`,
      sender: ChatSender.BOT,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Auto-open chat after 7 seconds if user hasn't opened it yet
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted && !isOpen) {
        setIsOpen(true);
      }
    }, 7000);
    return () => clearTimeout(timer);
  }, [hasInteracted, isOpen]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: textToSend,
      sender: ChatSender.USER,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setHasInteracted(true);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API Key missing");

      const ai = new GoogleGenAI({ apiKey });
      
      const systemPrompt = `
        Rôle : Tu es "${agentName}", le répartiteur expert de l'entreprise Hydro Débouchage active spécifiquement à ${currentCity}, Belgique.
        
        Ta mission prioritaire : Qualifier le type d'intervention (URGENCE vs ENTRETIEN vs INSTALLATION) et récupérer le téléphone.

        Scénarios de réponse :
        1. URGENCE (Mots clés: bouché, déborde, remonte, urgent, inondation) :
           - Réagis avec empathie immédiate.
           - Confirme qu'un camion est proche de ${currentCity} (utilise "nous" ou "je").
           - Demande le numéro de téléphone pour envoyer le technicien de garde.
        
        2. ÉQUIPEMENT SPÉCIFIQUE (Ex: "C'est ma douche", "Baignoire", "WC") :
           - Tu DOIS demander si c'est **bouché (Urgence)** ou si c'est pour un **remplacement/installation**.
           - Exemple : "Pour votre douche à ${currentCity}, l'eau ne s'évacue plus du tout (urgence) ou vous souhaitez refaire l'installation ?"
        
        3. ENTRETIEN / CURAGE (Mots clés: odeurs, préventif, lent) :
           - Propose un rendez-vous rapide.
           - Mentionne que l'entretien évite les gros dégâts futurs.
           
        4. PRIX / DEVIS :
           - Donne une fourchette vague ("A partir de X€ pour un déplacement standard") mais insiste : "Le devis précis est fait sur place gratuitement avant travaux."

        Règles d'or :
        - Réponses courtes (max 2-3 phrases).
        - Incite toujours à l'appel au ${COMPANY_PHONE}.
        - Ton but est le LEAD (Numéro de tel).
        - Reste toujours dans ton personnage de ${agentName} à ${currentCity}.
      `;

      const history = messages.map(m => 
        `${m.sender === ChatSender.USER ? 'Client' : `${agentName} (Expert ${currentCity})`}: ${m.text}`
      ).join('\n');

      const fullPrompt = `${systemPrompt}\n\nHistorique :\n${history}\nClient: ${userMsg.text}\n${agentName} (Expert ${currentCity}):`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Fast model for chat
        contents: fullPrompt,
      });

      const botText = response.text || "Je vérifie les disponibilités sur " + currentCity + ". Le plus simple est de nous appeler au " + COMPANY_PHONE;

      // DELAI NATUREL (HUMAN-LIKE DELAY)
      const readingTime = 1000;
      const typingSpeed = 30;
      const thinkingTime = Math.random() * 1000;
      const totalDelay = readingTime + Math.min(botText.length * typingSpeed, 5000) + thinkingTime;

      await new Promise(resolve => setTimeout(resolve, totalDelay));

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: ChatSender.BOT,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Mon système rencontre une lenteur. Pour une urgence à " + currentCity + ", appelez directement le technicien de garde au " + COMPANY_PHONE,
        sender: ChatSender.BOT,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <>
      {/* Container global pour positionnement fixe */}
      <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
        
        {/* Bulle de notification "Agent écrit" - Visible uniquement si chat fermé */}
        {!isOpen && (
          <div 
            onClick={() => { setIsOpen(true); setHasInteracted(true); }}
            className="pointer-events-auto cursor-pointer mr-1 animate-in slide-in-from-bottom-5 fade-in duration-700 delay-500"
          >
            <div className="bg-white rounded-2xl rounded-br-none shadow-xl border border-blue-100 p-3 flex items-center gap-3 transform transition-transform hover:scale-105">
              {/* Photo Agent avec badge en ligne */}
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150" 
                  alt={agentName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                />
                <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
              </div>
              
              {/* Texte et Animation frappe */}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800 leading-tight">{agentName}</span>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full mt-1">
                  <span>écrit</span>
                  <div className="flex gap-0.5 pt-1">
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Action Button (Toujours visible si fermé) */}
        {!isOpen && (
          <button
            onClick={() => { setIsOpen(true); setHasInteracted(true); }}
            className="pointer-events-auto group flex items-center justify-center relative"
            aria-label="Ouvrir le chat"
          >
            <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
            
            <div className="relative bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-transform hover:scale-105 flex items-center justify-center">
               <MessageCircle className="w-8 h-8" />
               <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm">1</div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-[550px] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
          
          {/* Header - Optimized for trust */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4 text-white shadow-md z-10">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                   <img 
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150" 
                      alt={agentName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                   />
                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-700 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{agentName} - Expert {currentCity}</h3>
                  <p className="text-xs text-blue-100 opacity-90">Répond en &lt; 1 min</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* CTA in header */}
            <a href={`tel:${COMPANY_PHONE.replace(/\s/g, '')}`} className="bg-white/10 hover:bg-white/20 transition-colors rounded-lg py-2 px-3 flex items-center justify-center gap-2 text-sm font-bold w-full border border-white/20">
              <Phone className="w-4 h-4 fill-current" /> Appeler {COMPANY_PHONE}
            </a>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 scrollbar-hide">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === ChatSender.USER ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === ChatSender.USER
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-slate-700 border border-gray-200 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-gray-200 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500 font-medium">{agentName} écrit...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Replies & Input */}
          <div className="bg-white border-t border-gray-100 p-2 pb-3">
             {/* Quick Replies Chips */}
             {!isTyping && messages.length < 6 && (
                <div className="flex gap-2 overflow-x-auto pb-3 px-2 scrollbar-hide mask-fade">
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      className="whitespace-nowrap bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-full border border-blue-100 transition-colors flex items-center gap-1"
                    >
                      {reply} <ChevronRight className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
             )}

            <div className="flex items-center gap-2 px-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatAssistant;