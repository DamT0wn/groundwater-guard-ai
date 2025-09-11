import { AlertTriangle, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface HealthScoreDisplayProps {
  score: number | null;
  location?: string;
  status?: string;
  level?: number;
  distanceKm?: number;
}

export const HealthScoreDisplay = ({ score, location, status, level, distanceKm }: HealthScoreDisplayProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "bg-gradient-success text-white";
    if (score >= 40) return "bg-gradient-warning text-white";
    return "bg-gradient-danger text-white";
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Good':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'Moderate':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'Critical':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center text-2xl font-bold shadow-water transition-all duration-500 ${
            score !== null ? getScoreColor(score) : "bg-muted text-muted-foreground"
          }`}>
            {score !== null ? score : "--"}
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full shadow-sm">
              Health Score
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {location && (
            <div className="flex items-center gap-2">
              {getStatusIcon(status)}
              <div>
                <div className="font-medium text-sm">{location}</div>
                {level && (
                  <div className="text-xs text-muted-foreground">
                    Water Level: {level}m below surface
                  </div>
                )}
                {distanceKm && (
                  <div className="text-xs text-muted-foreground">
                    {distanceKm.toFixed(1)} km from nearest data point
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!location && (
            <div className="text-sm text-muted-foreground">
              Enable location access to see your area's groundwater status
            </div>
          )}
        </div>
      </div>

      {score !== null && (
        <div className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-700 ${
                score >= 70 ? "bg-accent" : score >= 40 ? "bg-yellow-500" : "bg-destructive"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
          <div className="text-xs text-center text-muted-foreground">
            {score >= 70 ? "Good" : score >= 40 ? "Moderate Risk" : "High Risk"}
          </div>
        </div>
      )}
    </div>
  );
};