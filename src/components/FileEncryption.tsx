
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Lock, Unlock, Upload, Download, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { encryptFile, decryptFile, getOriginalExtension, getMimeType } from "@/utils/fileEncryption";

const FileEncryption = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileHash, setFileHash] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      generateFileHash(file);
      toast({
        title: "File Selected",
        description: `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
      });
    }
  };

  const generateFileHash = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setFileHash(hashHex.substring(0, 16) + "...");
  };

  const handleEncryptFile = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file first",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive"
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await encryptFile(selectedFile, password);
      
      if (result.success && result.data) {
        const encryptedBlob = new Blob([result.data], {
          type: 'application/octet-stream'
        });
        
        const url = URL.createObjectURL(encryptedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFile.name}.enc`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: "File encrypted and downloaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to encrypt file",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during encryption",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const handleDecryptFile = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an encrypted file first",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter the decryption password",
        variant: "destructive"
      });
      return;
    }

    // Check if file has .enc extension
    if (!selectedFile.name.endsWith('.enc')) {
      toast({
        title: "Warning",
        description: "Selected file doesn't appear to be encrypted (no .enc extension)",
        variant: "destructive"
      });
    }

    setIsProcessing(true);
    
    try {
      const result = await decryptFile(selectedFile, password);
      
      if (result.success && result.data) {
        // Get original filename and extension
        const originalName = selectedFile.name.replace('.enc', '');
        const extension = getOriginalExtension(selectedFile.name);
        const mimeType = getMimeType(extension);
        
        const decryptedBlob = new Blob([result.data], {
          type: mimeType
        });
        
        const url = URL.createObjectURL(decryptedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = originalName;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "Success",
          description: "File decrypted and downloaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to decrypt file",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during decryption",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          File Encryption & Decryption
        </CardTitle>
        <CardDescription className="text-slate-400">
          Secure your files with password-based encryption
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div>
          <Label htmlFor="file" className="text-white mb-2 block">
            Select File
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="file"
              type="file"
              onChange={handleFileSelect}
              className="bg-slate-700 border-slate-600 text-white file:bg-cyan-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
            />
            <Upload className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        {/* File Info */}
        {selectedFile && (
          <Card className="bg-slate-700/50 border border-slate-600">
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">File Name:</span>
                  <span className="text-white font-mono">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size:</span>
                  <span className="text-white">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SHA-256 Hash:</span>
                  <span className="text-green-400 font-mono text-sm">{fileHash}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password Input */}
        <div>
          <Label htmlFor="password" className="text-white mb-2 block">
            Encryption Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleEncryptFile}
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isProcessing ? "Encrypting..." : "Encrypt File"}
          </Button>
          <Button
            onClick={handleDecryptFile}
            disabled={isProcessing}
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white"
          >
            <Unlock className="h-4 w-4 mr-2" />
            {isProcessing ? "Decrypting..." : "Decrypt File"}
          </Button>
        </div>

        {/* Security Notice */}
        <Card className="bg-amber-900/20 border border-amber-600/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-amber-400 font-medium">Security Features</h4>
                <p className="text-amber-200 text-sm mt-1">
                  Files are encrypted using AES-256-GCM with PBKDF2 key derivation (100,000 iterations). 
                  Each file uses a unique salt and initialization vector for maximum security.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default FileEncryption;
