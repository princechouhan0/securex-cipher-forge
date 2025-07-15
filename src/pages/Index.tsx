
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, FileText, Image, MessageCircle } from "lucide-react";
import TextEncryption from "@/components/TextEncryption";
import FileEncryption from "@/components/FileEncryption";
import Steganography from "@/components/Steganography";
import SecurityDashboard from "@/components/SecurityDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-10 w-10 text-cyan-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              SecureX
            </h1>
          </div>
          <p className="text-slate-300 text-lg">All-in-One Cryptographic Security Suite</p>
          <p className="text-slate-400 text-sm mt-2">
            Ensuring Confidentiality, Integrity & Availability
          </p>
        </div>

        {/* Security Dashboard */}
        <SecurityDashboard />

        {/* Main Tools */}
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger 
              value="text" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <Lock className="h-4 w-4" />
              Text Encryption
            </TabsTrigger>
            <TabsTrigger 
              value="file" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              File Security
            </TabsTrigger>
            <TabsTrigger 
              value="steganography" 
              className="flex items-center gap-2 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <Image className="h-4 w-4" />
              Steganography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="mt-6">
            <TextEncryption />
          </TabsContent>

          <TabsContent value="file" className="mt-6">
            <FileEncryption />
          </TabsContent>

          <TabsContent value="steganography" className="mt-6">
            <Steganography />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
