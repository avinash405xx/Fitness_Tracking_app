import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatBox() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your fitness assistant. I'm here to help you with fitness, wellness, and lifestyle advice. How can I support your fitness journey today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fitness-chat`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: input.trim(),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col h-full">
      <div className="bg-gradient-to-r from-lime-400 to-lime-500 p-4 sm:p-6 rounded-t-2xl sm:rounded-t-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-lime-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">Fitness Assistant</h3>
            <p className="text-xs sm:text-sm text-gray-700">Your personal wellness coach</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4 min-h-0">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                message.role === 'user'
                  ? 'bg-lime-400 text-gray-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className="text-[10px] sm:text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex items-end space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about fitness, nutrition, workouts..."
            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-lime-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-lime-400 hover:bg-lime-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" />
          </button>
        </div>
      </div>
    </div>
  );
}
