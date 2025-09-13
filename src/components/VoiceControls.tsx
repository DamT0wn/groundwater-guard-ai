import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceControlsProps {
  onSpeechResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceControls = ({ onSpeechResult, isListening, setIsListening }: VoiceControlsProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onSpeechResult(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not understand speech. Please try again.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }
  }, [language, onSpeechResult, setIsListening, toast]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Speak now in " + (language === 'hi-IN' ? 'Hindi' : 'English'),
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "Error",
          description: "Could not start voice recognition",
          variant: "destructive"
        });
      }
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "Could not speak the text",
          variant: "destructive"
        });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech not supported in this browser",
        variant: "destructive"
      });
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'en-US' ? 'hi-IN' : 'en-US';
    setLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang;
    }
    toast({
      title: "Language Changed",
      description: `Switched to ${newLang === 'hi-IN' ? 'Hindi' : 'English'}`,
    });
  };

  if (!isSupported) {
    return (
      <div className="text-xs text-muted-foreground p-2 border border-border rounded-md bg-muted/20">
        Voice controls not supported in this browser
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-card/50">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleListening}
        disabled={isSpeaking}
        className={`transition-all duration-300 ${
          isListening ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'hover:shadow-water'
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2 text-red-500" />
            Stop
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Speak
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={isSpeaking ? stopSpeaking : () => speakText("Hello! I'm Jal-Mitra, ready to help you with groundwater insights.")}
        className="transition-all duration-300 hover:shadow-water"
      >
        {isSpeaking ? (
          <>
            <VolumeX className="w-4 h-4 mr-2 text-red-500" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 mr-2" />
            Test TTS
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="transition-all duration-300 hover:shadow-water text-xs"
      >
        {language === 'en-US' ? 'EN' : 'हि'}
      </Button>

      {isListening && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-3 bg-red-400 rounded animate-pulse"></div>
          <div className="w-1 h-2 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-4 bg-red-400 rounded animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );

  // Expose the speakText function for external use
  (VoiceControls as any).speakText = speakText;
};