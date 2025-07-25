import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Image as ImageIcon, Eye, EyeOff, Upload, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { embedMessage, extractMessage, hasHiddenMessage } from "@/utils/steganography";

const Steganography = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [secretMessage, setSecretMessage] = useState("");
  const [extractedMessage, setExtractedMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [hasEmbeddedMessage, setHasEmbeddedMessage] = useState(false);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Check if image actually contains a hidden message
        try {
          const hasMessage = await hasHiddenMessage(file);
          setHasEmbeddedMessage(hasMessage);
          
          toast({
            title: "Image Selected",
            description: `Selected: ${file.name}${hasMessage ? ' (Contains hidden message)' : ''}`,
          });
        } catch (error) {
          setHasEmbeddedMessage(false);
          toast({
            title: "Image Selected",
            description: `Selected: ${file.name}`,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Please select a valid image file",
          variant: "destructive"
        });
      }
    }
  };

  const handleEmbedMessage = async () => {
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
    
    try {
      const result = await embedMessage(selectedImage, secretMessage);
      
      if (result.success && result.blob) {
        // Download the steganographic image
        const url = URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `stego_${selectedImage.name.replace(/\.[^/.]+$/, "")}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        // Mark that this image now has an embedded message
        setHasEmbeddedMessage(true);
        toast({
          title: "Success",
          description: "Message embedded in image successfully! Download started.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to embed message",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while embedding the message",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  const handleExtractMessage = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select a steganographic image first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await extractMessage(selectedImage);
      
      if (result.success && result.message) {
        setExtractedMessage(result.message);
        toast({
          title: "Success",
          description: "Hidden message extracted successfully",
        });
      } else {
        setExtractedMessage("No hidden message found in this image.");
        toast({
          title: "No Message Found",
          description: result.error || "This image doesn't appear to contain any hidden messages",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while extracting the message",
        variant: "destructive"
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <Card className="bg-slate-800/50 border border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-cyan-400" />
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
            onClick={handleEmbedMessage}
            disabled={isProcessing}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            {isProcessing ? "Embedding..." : "Hide Message"}
          </Button>
          <Button
            onClick={handleExtractMessage}
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
                <p className="text-green-400 font-mono">{extractedMessage}</p>
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
