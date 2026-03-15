import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, X, Send, Mic } from 'lucide-react';
import VoiceMode from './petbot/VoiceMode';

interface Message {
  id: number;
  type: 'Kaluii' | 'user';
  text: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: 'Kaluii',
    text: "Hey! Ask me anything about him! I know everything 👀",
  },
];

const suggestedQuestions = [
  "How did you two meet?",
  "What makes him special?",
  "What's the biggest green flag?",
  "Is he actually serious about this?",
  "Tell me something embarrassing about him.",
];

const predefinedResponses: Record<string, string> = {
  "What makes him special?": "Where do I even start? 😍 He's the kind of person who remembers the little things — your favorite snack, that random song you hummed once. He shows up, not just physically but emotionally. That's rare. That's special. 💖",
};

const PetBotChat = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessageToBackend = async (message: string) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Backend error:", error);
      return "Something went wrong 😢";
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSuggestionClick = async (question: string) => {
    setMessages(prev => [...prev, { id: prev.length + 1, type: 'user', text: question }]);

    if (predefinedResponses[question]) {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 800));
      setIsTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'Kaluii', text: predefinedResponses[question] }]);
    } else {
      setIsTyping(true);
      const aiReply = await sendMessageToBackend(question);
      setIsTyping(false);
      setMessages(prev => [...prev, { id: prev.length + 1, type: 'Kaluii', text: aiReply }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setMessages(prev => [...prev, { id: prev.length + 1, type: 'user', text: userText }]);
    setInputValue("");
    setIsTyping(true);
    const aiReply = await sendMessageToBackend(userText);
    setIsTyping(false);
    setMessages(prev => [...prev, { id: prev.length + 1, type: 'Kaluii', text: aiReply }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isMinimized ? (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-5 right-5 z-[1000] bg-card rounded-full px-4 py-2 shadow-lg flex items-center gap-2 hover:shadow-xl transition-shadow border border-border"
        >
          <span className="w-2 h-2 bg-[hsl(var(--carnival-red))] rounded-full pulse-dot" />
          <span className="font-bold text-sm text-foreground">💬 Pet Bot</span>
          <span className="bg-[hsl(var(--carnival-red))] text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed bottom-5 right-5 z-[1000] w-80 max-w-[calc(100vw-40px)] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
          style={{ height: mode === 'voice' ? '480px' : 'auto' }}
        >
          <AnimatePresence mode="wait">
            {mode === 'voice' ? (
              <motion.div
                key="voice"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full flex flex-col"
              >
                <VoiceMode onBack={() => setMode('text')} />
              </motion.div>
            ) : (
              <motion.div
                key="text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Header */}
                <div className="instagram-gradient p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full pulse-dot" />
                    <span className="text-white font-bold text-sm">Pet Bot (LIVE)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="text-white/80 hover:text-white"
                    >
                      <Minus size={18} />
                    </button>
                    <button
                      onClick={() => setIsMinimized(true)}
                      className="text-white/80 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* Chat area */}
                <div
                  ref={chatRef}
                  className="h-[350px] overflow-y-auto p-4 space-y-3 bg-muted/50"
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index < initialMessages.length ? 0 : 0.1 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex items-start gap-2 max-w-[80%]">
                        {message.type === 'Kaluii' && (
                          <span className="text-lg">🤖</span>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 text-sm ${
                            message.type === 'user'
                              ? 'bg-[hsl(var(--instagram-blue))] text-white'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {message.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">🤖</span>
                      <div className="bg-secondary rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Suggestions row */}
                <div className="px-3 pt-2 pb-0 bg-card border-t border-border overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 whitespace-nowrap pb-1">
                    {suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSuggestionClick(q)}
                        className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[hsl(var(--neon-pink)/0.4)] bg-[hsl(var(--neon-pink)/0.1)] text-[hsl(var(--neon-pink))] hover:bg-[hsl(var(--neon-pink)/0.2)] transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input area */}
                <div className="p-3 bg-card border-t border-border flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    className="flex-1 bg-secondary rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--instagram-blue))]"
                  />
                  {/* Voice mode button */}
                  <button
                    onClick={() => setMode('voice')}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105 bg-[hsl(var(--neon-pink)/0.15)] text-[hsl(var(--neon-pink))] hover:bg-[hsl(var(--neon-pink)/0.25)]"
                    title="Switch to voice mode"
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 rounded-full bg-[hsl(var(--instagram-blue))] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PetBotChat;
