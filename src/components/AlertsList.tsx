import { AlertTriangle, Info, TrendingDown, Droplets } from "lucide-react";

interface Alert {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'critical';
  timestamp: Date;
}

interface AlertsListProps {
  alerts: Alert[];
}

export const AlertsList = ({ alerts }: AlertsListProps) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <TrendingDown className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-primary" />;
      default:
        return <Droplets className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return "border-destructive/20 bg-destructive/5";
      case 'warning':
        return "border-yellow-200 bg-yellow-50";
      case 'info':
        return "border-primary/20 bg-primary/5";
      default:
        return "border-border bg-muted/20";
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Droplets className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <div className="text-sm">No alerts at this time</div>
        <div className="text-xs">Check back later for updates</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-sm ${getAlertStyle(alert.type)}`}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm leading-relaxed">
                {alert.message}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};