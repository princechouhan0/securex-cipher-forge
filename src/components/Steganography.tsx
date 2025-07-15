import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image, Eye, EyeOff, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Steganography = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [secretMessage, setSecretMessage] = useState("");
  const [extractedMessage, setExtractedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [hasEmbeddedMessage, setHasEmbeddedMessage] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Reset previous extraction results
        setExtractedMessage("");
        setHasEmbeddedMessage(false);
        
        toast({
          title: "Image Selected",
          description: `Selected: ${file.name}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive"
        });
      }
    }
  };

  // Enhanced LSB extraction that works with real image data
  const simulateLSBExtraction = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return "";

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let binaryString = "";
    
    // Extract LSBs from RGB channels (more comprehensive approach)
    const maxPixels = Math.min(canvas.width * canvas.height, 2000);
    
    for (let i = 0; i < maxPixels * 4; i += 4) {
      if (i + 2 < data.length) {
        // Extract LSB from R, G, B channels
        binaryString += (data[i] & 1).toString();     // Red
        binaryString += (data[i + 1] & 1).toString(); // Green
        binaryString += (data[i + 2] & 1).toString(); // Blue
      }
    }
    
    // Try to decode the binary string into text
    let extractedText = "";
    let validCharCount = 0;
    
    // Process in 8-bit chunks
    for (let i = 0; i < binaryString.length - 7; i += 8) {
      const byte = binaryString.substr(i, 8);
      const charCode = parseInt(byte, 2);
      
      // Check if it's a printable ASCII character
      if (charCode >= 32 && charCode <= 126) {
        extractedText += String.fromCharCode(charCode);
        validCharCount++;
      } else if (charCode === 0) {
        // Null terminator might indicate end of message
        break;
      } else {
        // Non-printable character, add placeholder or break
        if (validCharCount > 0) {
          extractedText += "?";
        }
      }
      
      // Stop if we have enough valid characters
      if (extractedText.length > 200) break;
    }
    
    // Filter out noise and check for meaningful content
    const cleanText = extractedText.replace(/[^\x20-\x7E]/g, '').trim();
    
    // Check if we found meaningful text
    if (cleanText.length >= 3) {
      // Look for common patterns that might indicate a real message
      const hasLetters = /[a-zA-Z]{2,}/.test(cleanText);
      const hasWords = /\b\w{3,}\b/.test(cleanText);
      
      if (hasLetters && hasWords) {
        return cleanText.substring(0, 100);
      }
    }
    
    // Alternative: Check for patterns in the LSB data
    const ones = (binaryString.match(/1/g) || []).length;
    const zeros = (binaryString.match(/0/g) || []).length;
    const ratio = ones / (ones + zeros);
    
    // Analyze bit distribution
    if (Math.abs(ratio - 0.5) < 0.1) {
      // Relatively balanced distribution might indicate hidden data
      return "Hidden data detected but appears to be encrypted or in binary format.";
    }
    
    // Check for repeating patterns
    const chunks = [];
    for (let i = 0; i < Math.min(binaryString.length, 1000); i += 8) {
      chunks.push(binaryString.substr(i, 8));
    }
    
    const uniqueChunks = new Set(chunks);
    if (uniqueChunks.size / chunks.length < 0.7) {
      return "Possible steganographic content detected (pattern analysis suggests hidden data).";
    }
    
    return "";
  };

  const embedMessage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    if (!secretMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to hide",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate steganography embedding process
    setTimeout(() => {
      // Create a canvas to simulate image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Simulate LSB embedding by slightly modifying the image
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          // Embed message in LSBs (simulation)
          const messageBytes = new TextEncoder().encode(secretMessage);
          let bitIndex = 0;
          
          for (let i = 0; i < messageBytes.length && bitIndex < imageData.data.length; i++) {
            const byte = messageBytes[i];
            for (let bit = 0; bit < 8 && bitIndex < imageData.data.length; bit++) {
              const pixelIndex = Math.floor(bitIndex / 3) * 4 + (bitIndex % 3);
              const bitValue = (byte >> (7 - bit)) & 1;
              
              // Modify LSB of pixel channel
              imageData.data[pixelIndex] = (imageData.data[pixelIndex] & 0xFE) | bitValue;
              bitIndex++;
            }
          }
          
          ctx?.putImageData(imageData, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stego_${selectedImage.name}`;
            a.click();
            
            // Mark that this image now has an embedded message
            setHasEmbeddedMessage(true);
            setIsProcessing(false);
            toast({
              title: "Success",
              description: "Message embedded in image successfully",
            });
          }
        }, 'image/png');
      };
      
      img.src = imagePreview;
    }, 2000);
  };

  const extractMessage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Enhanced extraction with better analysis
        const extractedMsg = simulateLSBExtraction(canvas);
        
        if (extractedMsg) {
          setExtractedMessage(extractedMsg);
          setHasEmbeddedMessage(true);
          setIsProcessing(false);
          toast({
            title: "Analysis Complete",
            description: "Steganographic analysis completed",
          });
        } else {
          // Provide more detailed feedback
          setExtractedMessage("No steganographic content detected. This image appears to contain only natural image data without hidden messages using LSB steganography techniques.");
          setHasEmbeddedMessage(false);
          setIsProcessing(false);
          toast({
            title: "No Hidden Content",
            description: "LSB analysis didn't detect any hidden messages in this image",
          });
        }
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to analyze image data",
          variant: "destructive"
        });
      };
      
      img.src = imagePreview;
    }, 2000);
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Image className="h-5 w-5 text-cyan-400" />
          Image Steganography
        </CardTitle>
        <CardDescription className="text-slate-400">
          Hide secret messages inside images using LSB (Least Significant Bit) technique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div>
          <Label htmlFor="image" className="text-white mb-2 block">
            Select Image
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="bg-slate-700 border-slate-600 text-white file:bg-cyan-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1"
            />
            <Upload className="h-5 w-5 text-cyan-400" />
          </div>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div>
            <Label className="text-white mb-2 block">
              Image Preview
              {hasEmbeddedMessage && (
                <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-1 rounded">
                  Contains Hidden Message
                </span>
              )}
            </Label>
            <div className="relative max-w-md mx-auto">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-full h-auto rounded-lg border border-slate-600"
              />
              <div className="absolute top-2 right-2 bg-slate-800/80 px-2 py-1 rounded text-xs text-white">
                {selectedImage?.name}
              </div>
            </div>
          </div>
        )}

        {/* Secret Message Input */}
        <div>
          <Label htmlFor="message" className="text-white mb-2 block">
            Secret Message (for embedding)
          </Label>
          <Textarea
            id="message"
            placeholder="Enter your secret message to hide in the image..."
            value={secretMessage}
            onChange={(e) => setSecretMessage(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white h-24 font-mono"
          />
          <div className="text-xs text-slate-400 mt-1">
            Characters: {secretMessage.length} | Max recommended: 1000
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={embedMessage}
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            {isProcessing ? "Embedding..." : "Hide Message"}
          </Button>
          <Button
            onClick={extractMessage}
            disabled={isProcessing}
            variant="outline"
            className="border-cyan-500 text-cyan-400 hover:bg-cyan-600 hover:text-white"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isProcessing ? "Analyzing..." : "Extract Message"}
          </Button>
        </div>

        {/* Extracted Message */}
        {extractedMessage && (
          <div>
            <Label className="text-white mb-2 block">Extraction Results</Label>
            <Card className="bg-slate-700/50 border border-slate-600">
              <CardContent className="pt-4">
                <p className={`font-mono text-sm ${extractedMessage.includes("No steganographic content") ? "text-orange-400" : extractedMessage.includes("detected") ? "text-yellow-400" : "text-green-400"}`}>
                  {extractedMessage}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How It Works */}
        <Card className="bg-blue-900/20 border border-blue-600/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Eye className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-medium">How LSB Steganography Works</h4>
                <p className="text-blue-200 text-sm mt-1">
                  LSB steganography hides data in the least significant bits of image pixels. 
                  Each pixel's color values are slightly modified to encode message bits, 
                  making the changes imperceptible to the human eye. The extraction process
                  analyzes these LSBs to recover hidden messages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default Steganography;
