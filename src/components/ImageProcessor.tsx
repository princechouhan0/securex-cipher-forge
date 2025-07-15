
import { useRef } from 'react';

interface ImageProcessorProps {
  onImageProcessed: (canvas: HTMLCanvasElement, imageData: ImageData) => void;
  onError: (error: string) => void;
}

export const ImageProcessor = ({ onImageProcessed, onError }: ImageProcessorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        reject(new Error('Canvas not available'));
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const img = new Image();
      
      img.onload = () => {
        try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          onImageProcessed(canvas, imageData);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  return (
    <canvas 
      ref={canvasRef} 
      style={{ display: 'none' }} 
      aria-hidden="true"
    />
  );
};
