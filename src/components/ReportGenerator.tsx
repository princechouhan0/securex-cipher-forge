import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
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
  Database,
  Trash2,
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface ReportData {
  id: string;
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
      id: crypto.randomUUID(),
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

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#dc2626'];

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

  const generateVisualReport = () => {
    // Create HTML content with embedded charts and professional styling
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SecureX Security Assessment Report</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; color: #334155; }
        .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 40px; border-radius: 12px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5rem; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 1.1rem; }
        .section { background: white; padding: 30px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .section h2 { color: #1e293b; border-bottom: 3px solid #0ea5e9; padding-bottom: 10px; margin-bottom: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #0ea5e9; }
        .metric-value { font-size: 2rem; font-weight: bold; color: #0ea5e9; }
        .metric-label { color: #64748b; font-size: 0.9rem; margin-top: 5px; }
        .chart-container { height: 300px; margin: 20px 0; }
        .risk-critical { color: #dc2626; font-weight: bold; }
        .risk-high { color: #ea580c; font-weight: bold; }
        .risk-medium { color: #d97706; font-weight: bold; }
        .risk-low { color: #16a34a; font-weight: bold; }
        .recommendation { background: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 10px 0; }
        .footer { text-align: center; color: #64748b; margin-top: 40px; padding: 20px; }
        ul { padding-left: 20px; }
        li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 SecureX Security Assessment Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Comprehensive Security Analysis & Risk Assessment</p>
    </div>

    <div class="section">
        <h2>📊 Executive Summary</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">78</div>
                <div class="metric-label">Security Score</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">15</div>
                <div class="metric-label">Total Operations</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">5</div>
                <div class="metric-label">Issues Found</div>
            </div>
            <div class="metric-card">
                <div class="metric-value">12</div>
                <div class="metric-label">Recommendations</div>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="securityChart"></canvas>
        </div>
    </div>

    <div class="section">
        <h2>🛡️ Security Findings</h2>
        <h3>Critical Issues (1)</h3>
        <ul>
            <li class="risk-critical">Telnet service enabled on Port 23 - IMMEDIATE ACTION REQUIRED</li>
        </ul>
        
        <h3>High Priority Issues (2)</h3>
        <ul>
            <li class="risk-high">Unencrypted HTTP traffic detected on Port 80</li>
            <li class="risk-high">SSH using default configuration on Port 22</li>
        </ul>
        
        <h3>Medium Priority Issues (2)</h3>
        <ul>
            <li class="risk-medium">Database ports exposed to network</li>
            <li class="risk-medium">Missing security headers on web services</li>
        </ul>
    </div>

    <div class="section">
        <h2>🔧 Remediation Recommendations</h2>
        
        <div class="recommendation">
            <h3>🚨 Immediate Actions (Critical Priority)</h3>
            <ul>
                <li><strong>Disable Telnet Service:</strong> sudo systemctl stop telnet && sudo systemctl disable telnet</li>
                <li><strong>Block Port 23:</strong> sudo ufw deny 23/tcp</li>
                <li><strong>Implement HTTPS Redirects:</strong> Configure web server to redirect HTTP to HTTPS</li>
                <li><strong>Harden SSH Configuration:</strong> Change default port, disable root login, use key-based auth</li>
            </ul>
        </div>

        <div class="recommendation">
            <h3>⚡ Security Improvements</h3>
            <ul>
                <li>Deploy network firewall rules to restrict unnecessary port access</li>
                <li>Implement intrusion detection system (IDS/IPS)</li>
                <li>Schedule regular automated security scans</li>
                <li>Establish security awareness training program</li>
                <li>Enable comprehensive logging and monitoring</li>
            </ul>
        </div>

        <div class="recommendation">
            <h3>📋 Compliance Measures</h3>
            <ul>
                <li>Document all encryption procedures and key management practices</li>
                <li>Implement role-based access control (RBAC) policies</li>
                <li>Establish regular backup verification and disaster recovery testing</li>
                <li>Update incident response plan and conduct tabletop exercises</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>🎯 CIA Triad Assessment</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-value">85%</div>
                <div class="metric-label">Confidentiality</div>
                <p style="font-size: 0.8rem; margin-top: 10px;">Strong encryption protocols in place</p>
            </div>
            <div class="metric-card">
                <div class="metric-value">78%</div>
                <div class="metric-label">Integrity</div>
                <p style="font-size: 0.8rem; margin-top: 10px;">Good hashing and verification systems</p>
            </div>
            <div class="metric-card">
                <div class="metric-value">72%</div>
                <div class="metric-label">Availability</div>
                <p style="font-size: 0.8rem; margin-top: 10px;">Needs redundancy improvements</p>
            </div>
        </div>
        
        <div class="chart-container">
            <canvas id="ciaChart"></canvas>
        </div>
    </div>

    <div class="section">
        <h2>📈 Activity Summary</h2>
        <h3>Encryption Operations (12)</h3>
        <ul>
            <li>AES-256 Text Encryption - 8 operations</li>
            <li>RSA File Encryption - 3 operations</li>
            <li>File Decryption - 1 operation</li>
        </ul>
        
        <h3>Network Scanning (8)</h3>
        <ul>
            <li>Port Scans - 3 targets analyzed</li>
            <li>Vulnerability Scans - 2 targets assessed</li>
            <li>Service Identification - 5 services catalogued</li>
        </ul>
        
        <h3>Steganography Operations (4)</h3>
        <ul>
            <li>Message Hiding - 2 operations</li>
            <li>Message Extraction - 2 operations</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>SecureX Security Suite v1.0</strong></p>
        <p>This report contains sensitive security information. Handle with appropriate confidentiality.</p>
        <p>Next assessment recommended within 30 days.</p>
    </div>

    <script>
        // Security Score Chart
        const ctx1 = document.getElementById('securityChart').getContext('2d');
        new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: ['Critical', 'High', 'Medium', 'Low', 'Secure'],
                datasets: [{
                    data: [1, 2, 2, 0, 10],
                    backgroundColor: ['#dc2626', '#ea580c', '#d97706', '#16a34a', '#0ea5e9']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: { display: true, text: 'Security Risk Distribution' }
                }
            }
        });

        // CIA Triad Chart
        const ctx2 = document.getElementById('ciaChart').getContext('2d');
        new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Confidentiality', 'Integrity', 'Availability'],
                datasets: [{
                    label: 'Score (%)',
                    data: [85, 78, 72],
                    backgroundColor: ['#0ea5e9', '#06b6d4', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, max: 100 }
                },
                plugins: {
                    title: { display: true, text: 'CIA Triad Assessment Scores' }
                }
            }
        });
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SecureX-Visual-Report-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Visual Report Generated",
      description: "Professional HTML report with charts has been downloaded",
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

  const deleteReport = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
    toast({
      title: "Report Deleted",
      description: "Security report has been removed from history",
    });
  };

  const refreshReports = () => {
    // Add a new sample report to simulate refresh
    const newReport: ReportData = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type: "comprehensive",
      summary: {
        total_operations: Math.floor(Math.random() * 20) + 10,
        security_level: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as any,
        issues_found: Math.floor(Math.random() * 8),
        recommendations: Math.floor(Math.random() * 15) + 5
      },
      details: {
        encryption_logs: [],
        vulnerability_scans: [],
        port_scans: [],
        steganography_logs: []
      }
    };
    
    setReports([newReport, ...reports]);
    toast({
      title: "Reports Refreshed",
      description: "Latest security data has been loaded",
    });
  };

  const viewReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // Generate a detailed view for the specific report
      generateVisualReport();
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

  // Chart data for dashboard
  const riskDistributionData = [
    { name: 'Critical', value: 1, color: '#dc2626' },
    { name: 'High', value: 2, color: '#ea580c' },
    { name: 'Medium', value: 2, color: '#d97706' },
    { name: 'Low', value: 0, color: '#16a34a' },
    { name: 'Secure', value: 10, color: '#0ea5e9' }
  ];

  const ciaTriadData = [
    { name: 'Confidentiality', score: 85 },
    { name: 'Integrity', score: 78 },
    { name: 'Availability', score: 72 }
  ];

  const activityTrendData = [
    { month: 'Jan', operations: 8 },
    { month: 'Feb', operations: 12 },
    { month: 'Mar', operations: 15 },
    { month: 'Apr', operations: 10 },
    { month: 'May', operations: 18 },
    { month: 'Jun', operations: 15 }
  ];

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
              onClick={generateVisualReport}
              variant="outline"
              className="h-20 flex flex-col gap-2 border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
            >
              <FileImage className="h-6 w-6" />
              <div>
                <div className="font-semibold">Visual Report</div>
                <div className="text-xs opacity-80">Professional HTML with charts</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Security Dashboard</CardTitle>
          <CardDescription className="text-slate-400">
            Real-time security metrics and activity overview with interactive charts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-slate-700">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="charts" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Analytics
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
                  <div className="text-2xl font-bold text-orange-400">5</div>
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
                  Security assessment complete. <strong>5 issues</strong> require attention. 
                  Review the vulnerability scan results and implement recommended fixes.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">Risk Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-sm">CIA Triad Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={ciaTriadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} />
                        <YAxis stroke="#9ca3af" fontSize={10} />
                        <Tooltip />
                        <Bar dataKey="score" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-700/50 border border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Security Activity Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={activityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="operations" 
                        stroke="#06b6d4" 
                        strokeWidth={2}
                        dot={{ fill: '#06b6d4' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Report History</h3>
                <Button 
                  onClick={refreshReports} 
                  variant="outline" 
                  size="sm"
                  className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card key={report.id} className="bg-slate-700/50 border border-slate-600">
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
                          <div className="flex gap-1 ml-2">
                            <Button
                              onClick={() => viewReport(report.id)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                            <Button
                              onClick={() => deleteReport(report.id)}
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-600/10"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
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