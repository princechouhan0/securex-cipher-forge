
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldCheck, Eye, FileCheck } from "lucide-react";

const SecurityDashboard = () => {
  const securityMetrics = [
    {
      title: "Confidentiality",
      description: "AES-256 & RSA Encryption",
      icon: Shield,
      status: "Active",
      color: "text-green-400"
    },
    {
      title: "Integrity",
      description: "SHA-256 Hash Verification",
      icon: ShieldCheck,
      status: "Verified",
      color: "text-blue-400"
    },
    {
      title: "Availability",
      description: "All Systems Operational",
      icon: Eye,
      status: "Online",
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {securityMetrics.map((metric, index) => (
        <Card key={index} className="bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
              <span className={`text-xs font-medium ${metric.color} bg-slate-700 px-2 py-1 rounded-full`}>
                {metric.status}
              </span>
            </div>
            <CardTitle className="text-white text-lg">{metric.title}</CardTitle>
            <CardDescription className="text-slate-400">
              {metric.description}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default SecurityDashboard;
