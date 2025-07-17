import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Wifi, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Server,
  Network,
  Lock,
  Unlock
} from "lucide-react";

interface PortResult {
  port: number;
  status: "open" | "closed" | "filtered";
  service: string;
  version?: string;
  risk: "low" | "medium" | "high" | "critical";
  description: string;
  recommendations: string[];
}

interface ScanPreset {
  name: string;
  ports: number[];
  description: string;
}

const PortScanner = () => {
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PortResult[]>([]);
  const [scanPreset, setScanPreset] = useState("common");
  const [customPorts, setCustomPorts] = useState("");
  const { toast } = useToast();

  const scanPresets: Record<string, ScanPreset> = {
    common: {
      name: "Common Ports",
      ports: [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3389, 5432, 3306],
      description: "Scan most commonly used ports"
    },
    web: {
      name: "Web Services",
      ports: [80, 443, 8080, 8443, 8000, 8888, 9000, 3000, 5000],
      description: "Focus on web server ports"
    },
    database: {
      name: "Database Ports",
      ports: [3306, 5432, 1433, 1521, 27017, 6379, 5984],
      description: "Common database service ports"
    },
    all: {
      name: "Full Scan",
      ports: Array.from({ length: 1000 }, (_, i) => i + 1),
      description: "Comprehensive scan of first 1000 ports"
    }
  };

  const commonServices: Record<number, { name: string; risk: PortResult["risk"]; description: string; recommendations: string[] }> = {
    21: {
      name: "FTP",
      risk: "high",
      description: "File Transfer Protocol - often misconfigured",
      recommendations: [
        "Disable anonymous FTP access",
        "Use SFTP or FTPS instead",
        "Implement strong authentication",
        "Regular security audits"
      ]
    },
    22: {
      name: "SSH",
      risk: "medium",
      description: "Secure Shell - secure but target for brute force",
      recommendations: [
        "Change default port",
        "Use key-based authentication",
        "Disable root login",
        "Implement fail2ban"
      ]
    },
    23: {
      name: "Telnet",
      risk: "critical",
      description: "Unencrypted remote access protocol",
      recommendations: [
        "Disable Telnet service",
        "Use SSH instead",
        "Block port 23 on firewall",
        "Remove Telnet client/server"
      ]
    },
    25: {
      name: "SMTP",
      risk: "medium",
      description: "Email server - can be exploited for spam",
      recommendations: [
        "Configure proper authentication",
        "Implement rate limiting",
        "Use TLS encryption",
        "Regular security updates"
      ]
    },
    53: {
      name: "DNS",
      risk: "low",
      description: "Domain Name System",
      recommendations: [
        "Disable DNS recursion if not needed",
        "Implement DNS filtering",
        "Use secure DNS (DoH/DoT)",
        "Regular cache clearing"
      ]
    },
    80: {
      name: "HTTP",
      risk: "medium",
      description: "Unencrypted web traffic",
      recommendations: [
        "Redirect to HTTPS",
        "Install SSL certificate",
        "Enable security headers",
        "Use HSTS"
      ]
    },
    443: {
      name: "HTTPS",
      risk: "low",
      description: "Encrypted web traffic",
      recommendations: [
        "Keep SSL certificates updated",
        "Use strong cipher suites",
        "Enable HSTS",
        "Regular security scans"
      ]
    },
    3306: {
      name: "MySQL",
      risk: "high",
      description: "MySQL database server",
      recommendations: [
        "Change default port",
        "Use strong passwords",
        "Limit network access",
        "Enable SSL/TLS"
      ]
    },
    3389: {
      name: "RDP",
      risk: "high",
      description: "Remote Desktop Protocol",
      recommendations: [
        "Enable Network Level Authentication",
        "Use VPN for remote access",
        "Implement account lockout",
        "Change default port"
      ]
    },
    5432: {
      name: "PostgreSQL",
      risk: "high",
      description: "PostgreSQL database server",
      recommendations: [
        "Configure pg_hba.conf properly",
        "Use SSL connections",
        "Limit network access",
        "Regular security updates"
      ]
    }
  };

  const getPortsToScan = (): number[] => {
    if (scanPreset === "custom") {
      return customPorts
        .split(",")
        .map(p => parseInt(p.trim()))
        .filter(p => p > 0 && p <= 65535);
    }
    return scanPresets[scanPreset]?.ports || [];
  };

  const startScan = async () => {
    if (!target) {
      toast({
        title: "Error",
        description: "Please enter a target IP address",
        variant: "destructive"
      });
      return;
    }

    const portsToScan = getPortsToScan();
    if (portsToScan.length === 0) {
      toast({
        title: "Error",
        description: "No valid ports to scan",
        variant: "destructive"
      });
      return;
    }

    setScanning(true);
    setProgress(0);
    setResults([]);

    const scanResults: PortResult[] = [];

    // Simulate port scanning
    for (let i = 0; i < portsToScan.length; i++) {
      const port = portsToScan[i];
      await new Promise(resolve => setTimeout(resolve, 50)); // Simulate scan time

      // Simulate random port states (some open, some closed)
      const isOpen = Math.random() > 0.8; // 20% chance of being open
      const service = commonServices[port];

      if (isOpen) {
        scanResults.push({
          port,
          status: "open",
          service: service?.name || "Unknown",
          risk: service?.risk || "low",
          description: service?.description || "Service running on this port",
          recommendations: service?.recommendations || ["Monitor this service", "Ensure it's properly secured"]
        });
      }

      setProgress(((i + 1) / portsToScan.length) * 100);
    }

    setResults(scanResults);
    setScanning(false);

    toast({
      title: "Port Scan Complete",
      description: `Found ${scanResults.length} open ports out of ${portsToScan.length} scanned`,
    });
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Unlock className="h-4 w-4 text-red-400" />;
      case "closed": return <Lock className="h-4 w-4 text-green-400" />;
      case "filtered": return <Shield className="h-4 w-4 text-yellow-400" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const exportResults = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      target,
      scanType: scanPreset,
      totalScanned: getPortsToScan().length,
      openPorts: results.length,
      results,
      summary: {
        critical: results.filter(r => r.risk === "critical").length,
        high: results.filter(r => r.risk === "high").length,
        medium: results.filter(r => r.risk === "medium").length,
        low: results.filter(r => r.risk === "low").length
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `port-scan-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Port scan report has been downloaded",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Port Scanner</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Scan target systems for open ports and running services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Target IP Address
              </label>
              <Input
                placeholder="e.g., 192.168.1.1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={scanning}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Scan Type
              </label>
              <Select value={scanPreset} onValueChange={setScanPreset} disabled={scanning}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {Object.entries(scanPresets).map(([key, preset]) => (
                    <SelectItem key={key} value={key} className="text-white">
                      {preset.name} - {preset.description}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom" className="text-white">
                    Custom Ports
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {scanPreset === "custom" && (
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">
                Custom Ports (comma-separated)
              </label>
              <Input
                placeholder="e.g., 80,443,8080,3000"
                value={customPorts}
                onChange={(e) => setCustomPorts(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                disabled={scanning}
              />
            </div>
          )}

          <Button 
            onClick={startScan} 
            disabled={scanning}
            className="w-full bg-cyan-600 hover:bg-cyan-700"
          >
            {scanning ? "Scanning..." : "Start Port Scan"}
          </Button>

          {scanning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Scanning ports...</span>
                <span className="text-cyan-400">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Open Ports</CardTitle>
                <CardDescription className="text-slate-400">
                  Found {results.length} open ports with security analysis
                </CardDescription>
              </div>
              <Button onClick={exportResults} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result) => (
                <Card key={result.port} className="bg-slate-700/50 border border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">Port {result.port}</span>
                            <Badge variant="outline" className="text-xs">
                              {result.service}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300">{result.description}</p>
                        </div>
                      </div>
                      <Badge className={getRiskColor(result.risk)}>
                        {result.risk.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-green-400 mb-2">Security Recommendations:</h5>
                      <ul className="space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-slate-300 flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.length === 0 && !scanning && (
        <Alert className="bg-slate-800/50 border border-slate-700">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-slate-300">
            No open ports detected. Configure your scan parameters and start scanning to identify running services.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PortScanner;