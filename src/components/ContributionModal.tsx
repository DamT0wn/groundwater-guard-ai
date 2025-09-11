import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContributionData {
  depth: string;
  quality: string;
  pumpingHours: string;
  notes: string;
  contactInfo: string;
}

interface ContributionModalProps {
  userLocation?: { lat: number; lon: number; address: string };
}

export const ContributionModal = ({ userLocation }: ContributionModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ContributionData>({
    depth: "",
    quality: "",
    pumpingHours: "",
    notes: "",
    contactInfo: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.depth || !formData.quality) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the water depth and quality.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thank you for contributing!",
        description: "Your groundwater data has been submitted and will help improve local predictions.",
      });
      
      setFormData({
        depth: "",
        quality: "",
        pumpingHours: "",
        notes: "",
        contactInfo: ""
      });
      setIsOpen(false);
      setIsSubmitting(false);
    }, 2000);
  };

  const handleInputChange = (field: keyof ContributionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-warning hover:opacity-90 transition-all duration-300 shadow-water hover:shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Contribute Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Contribute Groundwater Data
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {userLocation && (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="text-sm font-medium text-foreground">Location</div>
              <div className="text-xs text-muted-foreground">
                {userLocation.address}
              </div>
              <div className="text-xs text-muted-foreground">
                {userLocation.lat.toFixed(5)}, {userLocation.lon.toFixed(5)}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="depth">Water Depth (meters below surface) *</Label>
            <Input
              id="depth"
              type="number"
              step="0.1"
              placeholder="e.g., 15.5"
              value={formData.depth}
              onChange={(e) => handleInputChange('depth', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality">Water Quality *</Label>
            <Select value={formData.quality} onValueChange={(value) => handleInputChange('quality', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select water quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent - Clear, no taste/odor</SelectItem>
                <SelectItem value="good">Good - Slight taste/mineral content</SelectItem>
                <SelectItem value="fair">Fair - Noticeable taste, usable</SelectItem>
                <SelectItem value="poor">Poor - Strong taste/odor, requires treatment</SelectItem>
                <SelectItem value="unusable">Unusable - Not suitable for consumption</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pumpingHours">Daily Pumping Hours</Label>
            <Input
              id="pumpingHours"
              type="number"
              step="0.5"
              placeholder="e.g., 8"
              value={formData.pumpingHours}
              onChange={(e) => handleInputChange('pumpingHours', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any observations about seasonal changes, well performance, etc."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Info (optional)</Label>
            <Input
              id="contact"
              type="text"
              placeholder="Phone or email for follow-up"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground border-t pt-3 mt-4">
          Your data helps improve groundwater predictions for the community. All submissions are verified before being added to the database.
        </div>
      </DialogContent>
    </Dialog>
  );
};