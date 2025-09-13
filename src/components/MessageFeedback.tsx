import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MessageFeedbackProps {
  messageId: string;
  messageText: string;
  onFeedback: (messageId: string, feedback: 'positive' | 'negative', correction?: string) => void;
}

export const MessageFeedback = ({ messageId, messageText, onFeedback }: MessageFeedbackProps) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correction, setCorrection] = useState("");
  const { toast } = useToast();

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    
    if (type === 'positive') {
      onFeedback(messageId, type);
      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve Jal-Mitra.",
      });
    } else {
      setShowCorrection(true);
    }
  };

  const handleCorrection = () => {
    if (correction.trim()) {
      onFeedback(messageId, 'negative', correction);
      toast({
        title: "Feedback Recorded",
        description: "Thank you for helping us improve our responses!",
      });
      setShowCorrection(false);
      setCorrection("");
    }
  };

  const handleCancel = () => {
    setShowCorrection(false);
    setCorrection("");
    setFeedback(null);
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">Was this helpful?</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('positive')}
            disabled={feedback !== null}
            className={`h-8 w-8 p-0 transition-all duration-300 ${
              feedback === 'positive' 
                ? 'bg-green-50 text-green-600 border border-green-200' 
                : 'hover:bg-green-50 hover:text-green-600'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFeedback('negative')}
            disabled={feedback !== null}
            className={`h-8 w-8 p-0 transition-all duration-300 ${
              feedback === 'negative' 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'hover:bg-red-50 hover:text-red-600'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Dialog open={showCorrection} onOpenChange={setShowCorrection}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Help Us Improve
            </DialogTitle>
            <DialogDescription>
              What would be a better response to your question?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-1">Original response:</p>
              <p className="text-sm">{messageText}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Your suggested improvement:
              </label>
              <Textarea
                value={correction}
                onChange={(e) => setCorrection(e.target.value)}
                placeholder="Please provide a better response or correction..."
                className="min-h-[100px] transition-all duration-300 focus:shadow-water"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleCorrection}
              disabled={!correction.trim()}
              className="bg-gradient-primary hover:opacity-90"
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};