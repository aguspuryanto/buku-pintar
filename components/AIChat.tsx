
import React, { useState, useRef, useEffect } from 'react';
import { queryBusinessData } from '../services/geminiService';

interface AIChatProps {
  businessData: any;
}

const AIChat: React.FC<AIChatProps> = ({ businessData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Halo! Saya asisten BukuPintar. Ada yang bisa saya bantu terkait data stok, penjualan, atau keuangan hari ini?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await queryBusinessData(userMsg, businessData);
      setMessages(prev => [...prev, { role: 'assistant', text: response || "Maaf, saya tidak dapat menjawab saat ini." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: "Terjadi kesalahan sistem. Silakan coba lagi." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center border-2 border-indigo-400">
                <i className="fas fa-robot"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm">Asisten Pintar</h4>
                <p className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-200 shadow-sm leading-relaxed'
                }`}>
                  {m.text.split('\n').map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                  <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tanya stok, total penjualan..."
                className="flex-1 px-4 py-3 bg-slate-50 rounded-xl text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-indigo-700 hover:scale-110 transition-all duration-300 group"
        >
          <i className="fas fa-robot text-2xl group-hover:rotate-12 transition-transform"></i>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </button>
      )}
    </div>
  );
};

export default AIChat;
