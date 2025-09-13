import { useState, useEffect } from "react";
import { Droplets, MapPin, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { HealthScoreDisplay } from "@/components/HealthScoreDisplay";
import { AlertsList } from "@/components/AlertsList";
import { ContributionModal } from "@/components/ContributionModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { findNearestData, computeHealthScore, GROUNDWATER_DATA } from "@/data/groundwaterData";
import { uiLabels } from "@/data/uiLabels";

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

interface LocationData {
  lat: number;
  lon: number;
  address: string;
}

export interface ChatInterfaceProps {
  onLocationRequest: () => void;
  isLocationLoading: boolean;
  onLocationQuery: (location: string) => void;
  language: 'en' | 'hi';
}

const Index = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [groundwaterInfo, setGroundwaterInfo] = useState<{
    district: string;
    state: string;
    level: number;
    status: string;
    distanceKm: number;
  } | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  
  const { toast } = useToast();

  const generateAlerts = (score: number, status: string) => {
    const newAlerts: Alert[] = [];
    const timestamp = new Date();

    if (score < 35) {
      newAlerts.push({
        id: 'critical-1',
        message: 'Critical groundwater depletion detected. Immediate conservation measures recommended.',
        type: 'critical',
        timestamp
      });
      newAlerts.push({
        id: 'critical-2',
        message: 'Consider implementing rainwater harvesting and reducing pumping hours.',
        type: 'warning',
        timestamp
      });
    } else if (score < 60) {
      newAlerts.push({
        id: 'warning-1',
        message: 'Moderate risk detected. Monitor well levels closely and implement water-saving practices.',
        type: 'warning',
        timestamp
      });
      newAlerts.push({
        id: 'info-1',
        message: 'Seasonal variation normal. Continue monitoring during dry season.',
        type: 'info',
        timestamp
      });
    } else {
      newAlerts.push({
        id: 'good-1',
        message: 'Groundwater levels are stable. Maintain current conservation practices.',
        type: 'info',
        timestamp
      });
    }

    setAlerts(newAlerts);
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
      return;
    }

    setIsLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        try {
          // Reverse geocoding simulation (in real app, use a geocoding service)
          const address = `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
          
          setLocationData({ lat, lon, address });
          
          // Find nearest groundwater data
          const { entry, distanceKm } = findNearestData(lat, lon);
          
          if (entry) {
            const score = computeHealthScore(entry.level_m, entry.status);
            setHealthScore(score);
            setGroundwaterInfo({
              district: entry.district,
              state: entry.state,
              level: entry.level_m,
              status: entry.status,
              distanceKm
            });
            
            generateAlerts(score, entry.status);
            
            toast({
              title: "Location Found!",
              description: `Found groundwater data for ${entry.district}, ${entry.state}`,
            });
          } else {
            toast({
              title: "No Data Available",
              description: "No groundwater data found for your location.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Error processing location:', error);
          toast({
            title: "Error",
            description: "Failed to process location data.",
            variant: "destructive"
          });
        } finally {
          setIsLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsLocationLoading(false);
        
        let errorMessage = "Unable to get your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable location services.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out.";
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Handle location query from chat
  const handleLocationQuery = (location: string) => {
    const foundEntry = GROUNDWATER_DATA.find(entry => 
      entry.district.toLowerCase() === location.toLowerCase() || 
      entry.state.toLowerCase() === location.toLowerCase()
    );

    if (foundEntry) {
      const score = computeHealthScore(foundEntry.level_m, foundEntry.status);
      setHealthScore(score);
      setGroundwaterInfo({
        district: foundEntry.district,
        state: foundEntry.state,
        level: foundEntry.level_m,
        status: foundEntry.status,
        distanceKm: 0 // Distance is 0 as it's an exact match
      });
      generateAlerts(score, foundEntry.status);
      toast({
        title: "Groundwater Data Found",
        description: `Displaying data for ${foundEntry.district}, ${foundEntry.state}.`,
      });
    } else {
      setHealthScore(null);
      setGroundwaterInfo(null);
      setAlerts([]);
      toast({
        title: "Location Not Found",
        description: `Could not find groundwater data for "${location}". Please try a different city or state.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Language Switcher */}
      <div className="flex justify-end p-4">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as 'en' | 'hi')}
          className="border border-border rounded px-2 py-1 bg-card text-foreground"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-water">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Jal-Mitra</h1>
                <p className="text-sm text-muted-foreground">Predictive Groundwater Guardian</p>
              </div>
            </div>
            <Badge variant="outline" className="hidden sm:flex">
              SIH1697
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface - Left Side */}
          <div className="lg:col-span-2">
            <Card className="h-[80vh] shadow-water">
              <CardContent className="p-6 h-full">
                <ChatInterface 
                  onLocationRequest={handleLocationRequest}
                  isLocationLoading={isLocationLoading}
                  onLocationQuery={handleLocationQuery}
                  language={language}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            {/* Health Score */}
            <Card className="shadow-water">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Groundwater Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthScoreDisplay 
                  score={healthScore}
                  location={groundwaterInfo ? `${groundwaterInfo.district}, ${groundwaterInfo.state}` : undefined}
                  status={groundwaterInfo?.status}
                  level={groundwaterInfo?.level}
                  distanceKm={groundwaterInfo?.distanceKm}
                />
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="shadow-water">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Alerts & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlertsList alerts={alerts} />
              </CardContent>
            </Card>

            {/* Community Contribution */}
            <Card className="shadow-water">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Community Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Help improve groundwater predictions by contributing your local observations.
                </div>
                <ContributionModal userLocation={locationData} />
                <div className="text-xs text-muted-foreground">
                  Community contributions help create more accurate predictions for everyone.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Jal-Mitra - Smart India Hackathon 2024 Project (SIH1697)</p>
            <p className="mt-1">Empowering communities with predictive groundwater insights</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
