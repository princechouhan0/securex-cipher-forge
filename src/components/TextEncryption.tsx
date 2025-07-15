
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Unlock, Copy, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TextEncryption = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [algorithm, setAlgorithm] = useState("caesar");
  const [key, setKey] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Simple Caesar cipher implementation
  const caesarCipher = (text: string, shift: number, encrypt: boolean = true) => {
    const s = encrypt ? shift : -shift;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + s + 26) % 26) + start);
    });
  };

  // Simple Base64 encoding (for demonstration)
  const base64Cipher = (text: string, encrypt: boolean = true) => {
    if (encrypt) {
      return btoa(text);
    } else {
      try {
        return atob(text);
      } catch {
        return "Invalid encoded text";
      }
    }
  };

  // ROT13 implementation
  const rot13 = (text: string) => {
    return text.replace(/[a-zA-Z]/g, (char) => {
      const start = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
    });
  };

  const handleEncrypt = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to encrypt",
        variant: "destructive"
      });
      return;
    }

    setIsEncrypting(true);
    let result = "";

    switch (algorithm) {
      case "caesar":
        const shift = parseInt(key) || 3;
        result = caesarCipher(inputText, shift, true);
        break;
      case "base64":
        result = base64Cipher(inputText, true);
        break;
      case "rot13":
        result = rot13(inputText);
        break;
      default:
        result = inputText;
    }

    setTimeout(() => {
      setOutputText(result);
      setIsEncrypting(false);
      toast({
        title: "Success",
        description: "Text encrypted successfully",
      });
    }, 1000);
  };

  const handleDecrypt = () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to decrypt",
        variant: "destructive"
      });
      return;
    }

    setIsEncrypting(true);
    let result = "";

    switch (algorithm) {
      case "caesar":
        const shift = parseInt(key) || 3;
        result = caesarCipher(inputText, shift, false);
        break;
      case "base64":
        result = base64Cipher(inputText, false);
        break;
      case "rot13":
        result = rot13(inputText);
        break;
      default:
        result = inputText;
    }

    setTimeout(() => {
      setOutputText(result);
      setIsEncrypting(false);
      toast({
        title: "Success",
        description: "Text decrypted successfully",
      });
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
    });
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setKey("");
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-cyan-400" />
          Text Encryption & Decryption
        </CardTitle>
        <CardDescription className="text-slate-400">
          Secure your messages with various encryption algorithms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="algorithm" className="text-white mb-2 block">
              Encryption Algorithm
            </Label>
            <Select value={algorithm} onValueChange={setAlgorithm}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="caesar">Caesar Cipher</SelectItem>
                <SelectItem value="base64">Base64 Encoding</SelectItem>
                <SelectItem value="rot13">ROT13</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {algorithm === "caesar" && (
            <div>
              <Label htmlFor="key" className="text-white mb-2 block">
                Shift Value
              </Label>
              <Input
                id="key"
                type="number"
                placeholder="Enter shift value (default: 3)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          )}
        </div>

        {/* Input Text */}
        <div>
          <Label htmlFor="input" className="text-white mb-2 block">
            Input Text
          </Label>
          <Textarea
            id="input"
            placeholder="Enter your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white h-32 font-mono"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={handleEncrypt}
            disabled={isEncrypting}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isEncrypting ? "Encrypting..." : "Encrypt"}
          </Button>
          <Button
            onClick={handleDecrypt}
            disabled={isEncrypting}
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white"
          >
            <Unlock className="h-4 w-4 mr-2" />
            {isEncrypting ? "Decrypting..." : "Decrypt"}
          </Button>
          <Button
            onClick={clearAll}
            variant="outline"
            className="border-slate-500 text-slate-400 hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        {/* Output Text */}
        {outputText && (
          <div>
            <Label htmlFor="output" className="text-white mb-2 block">
              Output Text
            </Label>
            <div className="relative">
              <Textarea
                id="output"
                value={outputText}
                readOnly
                className="bg-slate-700 border-slate-600 text-green-400 h-32 font-mono"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-500"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextEncryption;
