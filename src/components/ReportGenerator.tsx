import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Shield, 
  Activity,
  Lock,
  Eye,
  Calendar,
  BarChart3,
  FileImage,
  Database
} from "lucide-react";

interface ReportData {
  timestamp: string;
  type: "encryption" | "vulnerability" | "port_scan" | "steganography" | "comprehensive";
  summary: {
    total_operations: number;
    security_level: "low" | "medium" | "high" | "critical";
    issues_found: number;
    recommendations: number;
  };
  details: any;
}

const ReportGenerator = () => {
  const [reports, setReports] = useState<ReportData[]>([
    {
      timestamp: new Date().toISOString(),
      type: "comprehensive",
      summary: {
        total_operations: 15,
        security_level: "high",
        issues_found: 3,
        recommendations: 12
      },
      details: {
        encryption_logs: [
          { action: "AES-256 Text Encryption", timestamp: "2024-01-15T10:30:00Z", status: "success" },
          { action: "RSA File Encryption", timestamp: "2024-01-15T11:15:00Z", status: "success" },
          { action: "File Decryption", timestamp: "2024-01-15T11:45:00Z", status: "success" }
        ],
        vulnerability_scans: [
          { target: "192.168.1.100", vulnerabilities: 2, severity: "medium" },
          { target: "example.com", vulnerabilities: 1, severity: "high" }
        ],
        port_scans: [
          { target: "192.168.1.1", open_ports: 5, high_risk_ports: 1 }
        ],
        steganography_logs: [
          { action: "Image Hide", file: "secret_message.png", timestamp: "2024-01-15T12:00:00Z" },
          { action: "Image Extract", file: "extracted_message.png", timestamp: "2024-01-15T12:15:00Z" }
        ]
      }
    }
  ]);
  const { toast } = useToast();

  const generateComprehensiveReport = () => {
    const reportData = {
      metadata: {
        title: "SecureX Comprehensive Security Report",
        generated: new Date().toISOString(),
        version: "1.0",
        author: "SecureX Security Suite"
      },
      executive_summary: {
        total_scans: 8,
        vulnerabilities_found: 5,
        encryption_operations: 12,
        steganography_operations: 4,
        overall_security_score: 78,
        risk_level: "Medium"
      },
      detailed_findings: {
        vulnerability_assessment: {
          critical_issues: 1,
          high_issues: 2,
          medium_issues: 2,
          low_issues: 0,
          remediation_priority: [
            "Disable Telnet service immediately",
            "Update SSH configuration",
            "Install SSL certificates for HTTP services"
          ]
        },
        port_analysis: {
          total_ports_scanned: 100,
          open_ports: 8,
          potentially_risky: 3,
          services_identified: [
            { port: 22, service: "SSH", risk: "Medium" },
            { port: 80, service: "HTTP", risk: "High" },
            { port: 443, service: "HTTPS", risk: "Low" }
          ]
        },
        encryption_audit: {
          algorithms_used: ["AES-256", "RSA-2048", "SHA-256"],
          files_encrypted: 5,
          messages_encrypted: 8,
          steganography_operations: 4,
          security_compliance: "FIPS 140-2 Level 1"
        }
      },
      recommendations: {
        immediate_actions: [
          "Disable all Telnet services",
          "Implement HTTPS for all web services",
          "Change default SSH port",
          "Enable firewall rules for unused ports"
        ],
        security_improvements: [
          "Implement network segmentation",
          "Deploy intrusion detection system",
          "Regular security audits",
          "Employee security training"
        ],
        compliance_measures: [
          "Document all encryption procedures",
          "Implement access control policies",
          "Regular backup verification",
          "Incident response plan updates"
        ]
      },
      cia_triad_assessment: {
        confidentiality: {
          score: 85,
          measures: ["AES-256 encryption", "Steganography capabilities", "Secure key management"],
          improvements: ["Multi-factor authentication", "Key rotation policies"]
        },
        integrity: {
          score: 78,
          measures: ["SHA-256 hashing", "Digital signatures", "File integrity monitoring"],
          improvements: ["Blockchain verification", "Automated integrity checks"]
        },
        availability: {
          score: 72,
          measures: ["Redundant systems", "Regular backups", "Monitoring tools"],
          improvements: ["Load balancing", "Disaster recovery plan", "24/7 monitoring"]
        }
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SecureX-Comprehensive-Report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Report Generated",
      description: "Comprehensive security report has been downloaded",
    });
  };

  const generatePDFReport = () => {
    // Simulate PDF generation
    const pdfContent = `
SecureX Security Assessment Report
Generated: ${new Date().toLocaleDateString()}

EXECUTIVE SUMMARY
================
Overall Security Score: 78/100
Risk Level: Medium
Total Vulnerabilities: 5
Encryption Operations: 12

DETAILED FINDINGS
================
Critical Issues: 1
- Telnet service enabled (Port 23)

High Priority Issues: 2
- Unencrypted HTTP traffic (Port 80)
- SSH using default configuration (Port 22)

RECOMMENDATIONS
==============
Immediate Actions:
1. Disable Telnet service
2. Implement HTTPS redirects
3. Harden SSH configuration
4. Close unused ports

Security Improvements:
1. Deploy firewall rules
2. Implement monitoring
3. Regular security audits
4. Staff training programs

COMPLIANCE STATUS
================
Encryption Standards: FIPS 140-2 Level 1
Data Protection: Partial compliance
Access Controls: Requires improvement
Audit Trail: Implemented

CIA TRIAD ASSESSMENT
==================
Confidentiality: 85/100 - Strong encryption in place
Integrity: 78/100 - Good hashing and verification
Availability: 72/100 - Needs redundancy improvements

END OF REPORT
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SecureX-Report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "PDF Report Generated",
      description: "Security report has been exported as text file",
    });
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-black";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "encryption": return <Lock className="h-4 w-4" />;
      case "vulnerability": return <Shield className="h-4 w-4" />;
      case "port_scan": return <Activity className="h-4 w-4" />;
      case "steganography": return <Eye className="h-4 w-4" />;
      case "comprehensive": return <BarChart3 className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            <CardTitle className="text-white">Security Report Generator</CardTitle>
          </div>
          <CardDescription className="text-slate-400">
            Generate comprehensive security reports with actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={generateComprehensiveReport}
              className="bg-cyan-600 hover:bg-cyan-700 h-20 flex flex-col gap-2"
            >
              <Database className="h-6 w-6" />
              <div>
                <div className="font-semibold">Comprehensive Report</div>
                <div className="text-xs opacity-80">All security data (JSON)</div>
              </div>
            </Button>
            <Button 
              onClick={generatePDFReport}
              variant="outline"
              className="h-20 flex flex-col gap-2 border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
            >
              <FileImage className="h-6 w-6" />
              <div>
                <div className="font-semibold">Executive Report</div>
                <div className="text-xs opacity-80">Summary format (TXT)</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Security Dashboard</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time security metrics and activity overview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">15</div>
                  <div className="text-sm text-slate-400">Total Operations</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">3</div>
                  <div className="text-sm text-slate-400">Issues Found</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">12</div>
                  <div className="text-sm text-slate-400">Recommendations</div>
                </div>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">78%</div>
                  <div className="text-sm text-slate-400">Security Score</div>
                </div>
              </div>

              <Alert className="bg-slate-700/50 border border-orange-500/50">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-slate-300">
                  Security assessment complete. <strong>3 issues</strong> require attention. 
                  Review the vulnerability scan results and implement recommended fixes.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-3">
                {reports.map((report, index) => (
                  <Card key={index} className="bg-slate-700/50 border border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(report.type)}
                          <div>
                            <div className="font-medium text-white capitalize">
                              {report.type.replace('_', ' ')} Report
                            </div>
                            <div className="text-sm text-slate-400">
                              {new Date(report.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSecurityLevelColor(report.summary.security_level)}>
                            {report.summary.security_level.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {report.summary.issues_found} issues
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerator;