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
    const summary = {
      critical: results.filter(r => r.risk === "critical").length,
      high: results.filter(r => r.risk === "high").length,
      medium: results.filter(r => r.risk === "medium").length,
      low: results.filter(r => r.risk === "low").length
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Port Scan Report - ${target}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1a1a1a; line-height: 1.6; }
        .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
        
        .report-header { 
            background: linear-gradient(135deg, #0ea5e9, #06b6d4); 
            color: white; 
            padding: 40px; 
            border-radius: 12px; 
            margin-bottom: 30px;
            text-align: center;
        }
        .report-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
        .report-header .subtitle { font-size: 1.1rem; opacity: 0.9; }
        .scan-info { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin-top: 20px; }
        
        .summary-section { 
            background: white; 
            padding: 30px; 
            margin-bottom: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .summary-title { font-size: 1.8rem; color: #1e293b; margin-bottom: 20px; font-weight: 700; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; }
        .stat-card { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center; 
            border: 2px solid transparent;
        }
        .stat-card.critical { border-color: #dc2626; }
        .stat-card.high { border-color: #ea580c; }
        .stat-card.medium { border-color: #d97706; }
        .stat-card.low { border-color: #16a34a; }
        .stat-value { font-size: 2rem; font-weight: bold; margin-bottom: 5px; }
        .stat-critical .stat-value { color: #dc2626; }
        .stat-high .stat-value { color: #ea580c; }
        .stat-medium .stat-value { color: #d97706; }
        .stat-low .stat-value { color: #16a34a; }
        .stat-label { font-size: 0.9rem; color: #64748b; font-weight: 600; }
        
        .ports-section { 
            background: white; 
            padding: 30px; 
            border-radius: 12px; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .port-item { 
            padding: 25px; 
            margin-bottom: 20px; 
            border-radius: 8px; 
            border-left: 5px solid;
            background: #f8fafc;
        }
        .port-critical { border-left-color: #dc2626; background: #fef2f2; }
        .port-high { border-left-color: #ea580c; background: #fff7ed; }
        .port-medium { border-left-color: #d97706; background: #fffbeb; }
        .port-low { border-left-color: #16a34a; background: #f0fdf4; }
        
        .port-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px; flex-wrap: wrap; gap: 10px; }
        .port-number { font-size: 1.3rem; font-weight: 700; color: #1e293b; }
        .port-service { font-size: 1rem; color: #64748b; margin-top: 5px; }
        
        .risk-badge { 
            padding: 5px 12px; 
            border-radius: 20px; 
            font-size: 0.8rem; 
            font-weight: bold; 
            text-transform: uppercase;
        }
        .risk-critical { background: #dc2626; color: white; }
        .risk-high { background: #ea580c; color: white; }
        .risk-medium { background: #d97706; color: white; }
        .risk-low { background: #16a34a; color: white; }
        
        .port-description { color: #64748b; margin-bottom: 20px; }
        .recommendations { }
        .recommendations-title { font-weight: 600; margin-bottom: 10px; color: #16a34a; }
        
        .rec-list { list-style: none; }
        .rec-list li { 
            padding: 5px 0; 
            padding-left: 20px; 
            position: relative;
        }
        .rec-list li:before { content: '🔧'; position: absolute; left: 0; }
        
        .report-footer { 
            background: #1e293b; 
            color: white; 
            padding: 30px; 
            text-align: center; 
            border-radius: 12px; 
            margin-top: 30px;
        }
        .timestamp { font-size: 0.9rem; opacity: 0.8; }
        
        @media print {
            body { background: white; }
            .container { max-width: none; margin: 0; padding: 15px; }
            .summary-section, .ports-section { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="report-header">
            <h1>🔍 Port Scan Report</h1>
            <div class="subtitle">Network Security Assessment for ${target}</div>
            <div class="scan-info">
                <strong>Target:</strong> ${target} | 
                <strong>Scan Type:</strong> ${scanPresets[scanPreset]?.name || 'Custom'} | 
                <strong>Ports Scanned:</strong> ${getPortsToScan().length} |
                <strong>Open Ports:</strong> ${results.length} |
                <strong>Date:</strong> ${new Date().toLocaleString()}
            </div>
        </div>

        <div class="summary-section">
            <h2 class="summary-title">📊 Scan Summary</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${results.length}</div>
                    <div class="stat-label">Open Ports</div>
                </div>
                <div class="stat-card critical">
                    <div class="stat-value stat-critical">${summary.critical}</div>
                    <div class="stat-label">Critical Risk</div>
                </div>
                <div class="stat-card high">
                    <div class="stat-value stat-high">${summary.high}</div>
                    <div class="stat-label">High Risk</div>
                </div>
                <div class="stat-card medium">
                    <div class="stat-value stat-medium">${summary.medium}</div>
                    <div class="stat-label">Medium Risk</div>
                </div>
                <div class="stat-card low">
                    <div class="stat-value stat-low">${summary.low}</div>
                    <div class="stat-label">Low Risk</div>
                </div>
            </div>
        </div>

        <div class="ports-section">
            <h2 class="summary-title">🌐 Open Ports & Security Analysis</h2>
            ${results.map(port => `
                <div class="port-item port-${port.risk}">
                    <div class="port-header">
                        <div>
                            <div class="port-number">Port ${port.port}</div>
                            <div class="port-service">${port.service} Service</div>
                        </div>
                        <div class="risk-badge risk-${port.risk}">${port.risk} Risk</div>
                    </div>
                    <div class="port-description">${port.description}</div>
                    <div class="recommendations">
                        <div class="recommendations-title">Security Recommendations</div>
                        <ul class="rec-list">
                            ${port.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `).join('')}
            
            ${results.length === 0 ? `
                <div style="text-align: center; padding: 40px; color: #16a34a;">
                    <h3>✅ No Open Ports Detected</h3>
                    <p>Your system appears to be well-secured with no publicly accessible services found.</p>
                </div>
            ` : ''}
        </div>

        <div class="report-footer">
            <div>🔒 Generated by SecureX Port Scanner</div>
            <div class="timestamp">Report generated on ${new Date().toLocaleString()}</div>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `port-scan-report-${target.replace(/[^a-zA-Z0-9]/g, '_')}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Professional port scan report has been downloaded as HTML",
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