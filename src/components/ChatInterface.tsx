import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Droplets, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceControls } from "./VoiceControls";
import { MessageFeedback } from "./MessageFeedback";
import { getRandomGreeting, getResponseTemplate, getContextualResponse } from "@/data/chatVariations";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showFeedback?: boolean;
}

interface ChatInterfaceProps {
  onLocationRequest: () => void;
  isLocationLoading: boolean;
}

export const ChatInterface = ({ onLocationRequest, isLocationLoading }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: getRandomGreeting(),
      sender: 'bot',
      timestamp: new Date(),
      showFeedback: true
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackData, setFeedbackData] = useState<Array<{messageId: string, feedback: 'positive' | 'negative', correction?: string}>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Contextual response based on user query - must be directly related to their question
    
    // Water level queries - provide specific water level data
    if (message.includes('water level') || message.includes('level') || message.includes('depth')) {
      return "Based on our current data monitoring, I can provide water level information for your area. To give you the most accurate readings, please share your location so I can access the nearest monitoring stations and provide current depth measurements.";
    }
    
    // Predictive insights and forecasting
    if (message.includes('predict') || message.includes('forecast') || message.includes('future') || message.includes('trend')) {
      return "I can provide 5-year predictive forecasts for your area using our AI models. These forecasts analyze historical patterns, seasonal variations, and climate data. Please share your location to access region-specific predictive insights and trend analysis.";
    }
    
    // Flood risk queries
    if (message.includes('flood') || message.includes('risk') || message.includes('danger')) {
      return "I can assess flood risks and provide early warning insights for your region. Our models analyze water levels, rainfall patterns, and historical flood data. Location access will allow me to provide specific risk assessments and safety recommendations for your area.";
    }
    
    // Conservation and water management
    if (message.includes('conserv') || message.includes('save') || message.includes('management')) {
      const template = getResponseTemplate('conservation');
      return `${template} Based on your local water data: 1) Implement drip irrigation systems 2) Harvest rainwater during monsoons 3) Use drought-resistant crop varieties 4) Monitor and fix leaks promptly 5) Apply mulching techniques to reduce evaporation. I can provide location-specific conservation strategies once you share your area.`;
    }
    
    // Agricultural/farming queries
    if (message.includes('crop') || message.includes('farm') || message.includes('agricult')) {
      return "For water-efficient agriculture in your region, I can recommend optimal crop selection, irrigation timing, and water management practices. Our data includes soil moisture patterns and seasonal water availability. Please share your location for tailored agricultural water management advice.";
    }
    
    // Status and monitoring
    if (message.includes('status') || message.includes('monitor') || message.includes('current')) {
      return "I can provide real-time status updates for groundwater and surface water in your area. This includes current levels, recent changes, and monitoring alerts. To access your local water status dashboard, please allow location access.";
    }
    
    // Data accuracy response - when no specific data available
    if (message.includes('data') || message.includes('accuracy') || message.includes('source')) {
      return "All my responses are based on verified water monitoring data from government sensors, satellite imagery, and community contributions. If I don't have specific information for your query, I'll clearly state that and offer alternative assistance. What specific water data would you like me to help you access?";
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('नमस्ते')) {
      return getRandomGreeting();
    }
    
    // Default contextual response - always relate back to water data capabilities
    return "I'm designed to provide accurate water-level data, predictive insights, and conservation guidance. Could you specify what type of water information you're looking for? I can help with current levels, forecasts, flood risks, or conservation strategies for your area.";
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
        timestamp: new Date(),
        showFeedback: true
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

  const handleSpeechResult = (transcript: string) => {
    setInputText(transcript);
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative', correction?: string) => {
    const feedbackEntry = { messageId, feedback, correction };
    setFeedbackData(prev => [...prev, feedbackEntry]);
    
    // In a real app, this would be sent to a backend
    console.log('Feedback collected:', feedbackEntry);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            Chat with Jal-Mitra 
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </h2>
          <p className="text-sm text-muted-foreground">Enhanced AI with voice & feedback</p>
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
              
              {/* Feedback for bot messages */}
              {message.sender === 'bot' && message.showFeedback && (
                <MessageFeedback 
                  messageId={message.id}
                  messageText={message.text}
                  onFeedback={handleFeedback}
                />
              )}
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
        {/* Voice Controls */}
        <VoiceControls 
          onSpeechResult={handleSpeechResult}
          isListening={isListening}
          setIsListening={setIsListening}
        />
        
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
            disabled={(!inputText.trim() || isTyping) && !isListening}
            className="bg-gradient-primary hover:opacity-90 transition-all duration-300 shadow-water hover:shadow-glow"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};