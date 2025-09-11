import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Droplets, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onLocationRequest: () => void;
  isLocationLoading: boolean;
}

export const ChatInterface = ({ onLocationRequest, isLocationLoading }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Jal-Mitra, your groundwater guardian. I can help you understand your local water situation and provide conservation tips. Click 'Check My Location' to get started!",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('water') && message.includes('conserv')) {
      return "Here are some effective water conservation tips: 1) Use drip irrigation for crops 2) Collect rainwater during monsoons 3) Plant drought-resistant crops 4) Check for leaks regularly 5) Use mulching to reduce evaporation. Would you like specific advice for your region?";
    }
    
    if (message.includes('crops') || message.includes('farm')) {
      return "For sustainable farming with limited groundwater: Consider crop rotation with legumes, use organic matter to improve soil water retention, and plant during optimal seasons. What crops are you currently growing?";
    }
    
    if (message.includes('status') || message.includes('level')) {
      return "To check your groundwater status, I need your location. Click the 'Check My Location' button so I can analyze the local water table data and provide specific insights for your area.";
    }
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm here to help you with groundwater management and conservation. What would you like to know about your local water resources?";
    }
    
    return "I understand you're asking about groundwater management. For the most accurate information about your area, please allow location access. I can then provide specific insights about local water levels, conservation strategies, and predictions for your region.";
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: simulateAIResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'location') {
      onLocationRequest();
    } else {
      setInputText(action);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Chat with Jal-Mitra</h2>
          <p className="text-sm text-muted-foreground">Your AI groundwater assistant</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-water">
          <Droplets className="w-5 h-5 text-white" />
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${
                message.sender === 'user'
                  ? 'bg-gradient-primary text-white rounded-br-md'
                  : 'bg-card border border-border text-card-foreground rounded-bl-md'
              }`}
            >
              <div className="text-sm leading-relaxed">{message.text}</div>
              <div className={`text-xs mt-2 opacity-70 ${
                message.sender === 'user' ? 'text-white/80' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLocationRequest()}
            disabled={isLocationLoading}
            className="transition-all duration-300 hover:shadow-water"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {isLocationLoading ? 'Getting Location...' : 'Check My Location'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('How can I conserve water for my crops?')}
            className="transition-all duration-300 hover:shadow-water"
          >
            <Droplets className="w-4 h-4 mr-2" />
            Conservation Tips
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('What are the groundwater trends in my area?')}
            className="transition-all duration-300 hover:shadow-water"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Trends
          </Button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Jal-Mitra about groundwater..."
            className="flex-1 transition-all duration-300 focus:shadow-water"
            disabled={isTyping}
          />
          <Button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-water hover:shadow-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};