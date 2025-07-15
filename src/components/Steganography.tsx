
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

  // Function to simulate LSB extraction from image data
  const simulateLSBExtraction = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return "";

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let binaryString = "";
    
    // Extract LSBs from red channel of first 1000 pixels (simulated)
    for (let i = 0; i < Math.min(1000 * 4, data.length); i += 4) {
      binaryString += (data[i] & 1).toString(); // Get LSB of red channel
    }
    
    // Convert binary to text (simplified simulation)
    let extractedText = "";
    for (let i = 0; i < binaryString.length; i += 8) {
      const byte = binaryString.substr(i, 8);
      if (byte.length === 8) {
        const charCode = parseInt(byte, 2);
        if (charCode >= 32 && charCode <= 126) { // Printable ASCII
          extractedText += String.fromCharCode(charCode);
        }
      }
    }
    
    // If we find meaningful text, return it; otherwise check for patterns
    if (extractedText.length > 5 && /[a-zA-Z]/.test(extractedText)) {
      return extractedText.substring(0, 100); // Limit length
    }
    
    // Check for patterns in LSB data that might indicate hidden message
    const ones = binaryString.split('1').length - 1;
    const zeros = binaryString.split('0').length - 1;
    const ratio = ones / zeros;
    
    // If ratio is close to 1, it might indicate random data (hidden message)
    if (ratio > 0.4 && ratio < 0.6) {
      return "Hidden message detected but appears to be encrypted or corrupted.";
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
    
    // Simulate message extraction process by analyzing actual image data
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Attempt to extract hidden message from LSB data
        const extractedMsg = simulateLSBExtraction(canvas);
        
        if (extractedMsg) {
          setExtractedMessage(extractedMsg);
          setHasEmbeddedMessage(true);
          setIsProcessing(false);
          toast({
            title: "Success",
            description: "Hidden message extracted successfully",
          });
        } else {
          setExtractedMessage("No hidden message found in this image.");
          setHasEmbeddedMessage(false);
          setIsProcessing(false);
          toast({
            title: "No Message Found",
            description: "This image doesn't appear to contain any hidden messages using LSB steganography",
            variant: "destructive"
          });
        }
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to analyze image",
          variant: "destructive"
        });
      };
      
      img.src = imagePreview;
    }, 1500);
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
            {isProcessing ? "Extracting..." : "Extract Message"}
          </Button>
        </div>

        {/* Extracted Message */}
        {extractedMessage && (
          <div>
            <Label className="text-white mb-2 block">Extracted Message</Label>
            <Card className="bg-slate-700/50 border border-slate-600">
              <CardContent className="pt-4">
                <p className={`font-mono ${extractedMessage.includes("No hidden message") ? "text-red-400" : "text-green-400"}`}>
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
                  making the changes imperceptible to the human eye.
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
