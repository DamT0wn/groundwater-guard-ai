import { useState, useRef, useEffect } from "react";
import { Send, MapPin, Droplets, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoiceControls } from "./VoiceControls";
import { MessageFeedback } from "./MessageFeedback";
import { getRandomGreeting } from "@/data/chatVariations";
import { GROUNDWATER_DATA } from "@/data/groundwaterData";
import { GroundwaterChart } from "./GroundwaterChart";

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
  onLocationQuery: (location: string) => void;
  language: 'en' | 'hi';
}

const labels = {
  en: {
    checkLocation: "Check My Location",
    conservationTips: "Conservation Tips",
    trends: "Trends",
  },
  hi: {
    checkLocation: "मेरी लोकेशन जांचें",
    conservationTips: "संरक्षण सुझाव",
    trends: "रुझान",
  }
};

export const ChatInterface = ({
  onLocationRequest,
  isLocationLoading,
  onLocationQuery,
  language
}: ChatInterfaceProps) => {
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
  const [chartComponent, setChartComponent] = useState<JSX.Element | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi'>(language);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, chartComponent]);

  // Mock trend data generator (replace with real data if available)
  const getTrendData = (district: string) => {
    // Example: Generate 10 years of mock data
    const base = GROUNDWATER_DATA.find(e => e.district.toLowerCase() === district.toLowerCase());
    if (!base) return [];
    return Array.from({ length: 10 }, (_, i) => ({
      name: (2016 + i).toString(),
      level: Math.max(0, base.level_m + (Math.random() - 0.5) * 2 - i * 0.1)
    }));
  };

  const isHindi = (text: string) =>
    /[\u0900-\u097F]/.test(text) || language === 'hi';

  const formatGroundwaterResponse = (entry: any, location: string, showTrend: boolean, lang: 'en' | 'hi') => {
    if (lang === 'hi') {
      return `
<div class="bg-card border border-border rounded-xl p-4 my-4 text-base text-foreground shadow-sm">
  <h2 class="text-lg font-semibold text-primary mb-2">भूजल स्थिति: ${entry.district}, ${entry.state}</h2>
  <ul class="list-disc list-inside space-y-1">
    <li><span class="font-medium">वर्तमान स्तर:</span> ${entry.level_m} मीटर</li>
    <li><span class="font-medium">स्थिति:</span> <span class="font-medium">${entry.status === "Safe" ? "सुरक्षित" : entry.status}</span></li>
  </ul>
  <p class="mt-2 text-muted-foreground">डेटा स्रोत: स्थानीय डेटा सेट (मॉक)</p>
  ${showTrend ? `<p class="mt-2 text-sm">10 वर्षों की प्रवृत्ति के लिए नीचे चार्ट देखें।</p>` : ""}
</div>
      `.trim();
    }

    let response = `
<div class="bg-card border border-border rounded-xl p-4 my-4 text-base text-foreground shadow-sm">
  <h2 class="text-lg font-semibold text-primary mb-2">Groundwater Status: ${entry.district}, ${entry.state}</h2>
  <ul class="list-disc list-inside space-y-1">
    <li><span class="font-medium">Current Level:</span> ${entry.level_m} m</li>
    <li><span class="font-medium">Status:</span> <span class="font-medium">${entry.status}</span></li>
  </ul>
  <p class="mt-2 text-muted-foreground">Data source: Local dataset (mock)</p>
  ${showTrend ? `<p class="mt-2 text-sm">See the chart below for the 10-year trend.</p>` : ""}
</div>
    `.trim();
    return response;
  };

  const simulateAIResponse = async (userMessage: string): Promise<{text: string, chart?: JSX.Element}> => {
    const message = userMessage.toLowerCase();
    setChartComponent(null);

    // Extract location and trend intent
    const trendMatch = /(trend|history|over time|chart|graph)/i.test(message);
    const locationMatch = message.match(/(?:of|in)\s+([a-zA-Z\s]+)/i);
    const location = locationMatch ? locationMatch[1].trim() : null;

    if (location) {
      const entry = GROUNDWATER_DATA.find(e =>
        e.district.toLowerCase() === location.toLowerCase() ||
        e.state.toLowerCase() === location.toLowerCase()
      );
      if (entry) {
        let chart;
        if (trendMatch) {
          const chartData = getTrendData(entry.district);
          chart = (
            <GroundwaterChart
              data={chartData}
              chartType="line"
              dataKey="level"
              nameKey="name"
              title={`Groundwater Level Trend: ${entry.district}`}
            />
          );
          setChartComponent(chart);
        }
        const userLang = isHindi(userMessage) ? 'hi' : language;
        return {
          text: formatGroundwaterResponse(entry, location, trendMatch, userLang)
        };
      } else {
        return {
          text: `
<div class="bg-card border border-border rounded-xl p-4 my-4 text-base text-foreground shadow-sm">
  <h2 class="text-lg font-semibold text-primary mb-2">No Data Available</h2>
  <p>Currently, real-time groundwater data for <span class="font-medium">${location}</span> is not available. Please try another location.</p>
</div>
          `.trim()
        };
      }
    }

    // Fallback: generic response
    return {
      text: `
<div class="bg-card border border-border rounded-xl p-4 my-4 text-base text-foreground shadow-sm">
  <h2 class="text-lg font-semibold text-primary mb-2">How can I help?</h2>
  <p>Ask about groundwater levels, trends, or status for any city or state in India. For example:</p>
  <ul class="list-disc list-inside space-y-1">
    <li>What is the groundwater level of Mumbai?</li>
    <li>Show groundwater trend of Pune.</li>
    <li>Is the water status safe in Delhi?</li>
  </ul>
</div>
      `.trim()
    };
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

    const { text, chart } = await simulateAIResponse(userMessage.text);

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      showFeedback: true
    };
    setMessages(prev => [...prev, botResponse]);
    setChartComponent(chart || null);
    setIsTyping(false);
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
              {/* Render formatted HTML for bot, plain text for user */}
              <div className="text-sm leading-relaxed">
                {message.sender === 'bot'
                  ? <span dangerouslySetInnerHTML={{ __html: message.text }} />
                  : message.text}
              </div>
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
        {/* Chart below the last bot message */}
        {chartComponent && (
          <div>{chartComponent}</div>
        )}
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
        {/* Language Selector */}
        <select
          value={selectedLanguage}
          onChange={e => setSelectedLanguage(e.target.value as 'en' | 'hi')}
          className="border border-border rounded px-2 py-1 bg-card text-foreground"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>

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
            {isLocationLoading ? 'Getting Location...' : labels[language].checkLocation}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('How can I conserve water for my crops?')}
            className="transition-all duration-300 hover:shadow-water"
          >
            <Droplets className="w-4 h-4 mr-2" />
            {labels[language].conservationTips}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction('What are the groundwater trends in my area?')}
            className="transition-all duration-300 hover:shadow-water"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {labels[language].trends}
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