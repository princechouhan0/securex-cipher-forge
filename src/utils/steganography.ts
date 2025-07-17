// LSB Steganography utilities for hiding and extracting messages in images

const MESSAGE_DELIMITER = "###END###";

export interface SteganographyResult {
  success: boolean;
  message?: string;
  error?: string;
  blob?: Blob;
}

/**
 * Convert string to binary representation
 */
function stringToBinary(str: string): string {
  return str
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

/**
 * Convert binary string to text
 */
function binaryToString(binary: string): string {
  const chars = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substr(i, 8);
    if (byte.length === 8) {
      chars.push(String.fromCharCode(parseInt(byte, 2)));
    }
  }
  return chars.join('');
}

/**
 * Embed a message into an image using LSB steganography
 */
export async function embedMessage(imageFile: File, message: string): Promise<SteganographyResult> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) {
        resolve({ success: false, error: "Failed to get image data" });
        return;
      }

      // Prepare message with delimiter
      const fullMessage = message + MESSAGE_DELIMITER;
      const binaryMessage = stringToBinary(fullMessage);
      
      // Check if image has enough capacity
      const maxCapacity = Math.floor((imageData.data.length / 4) * 3); // 3 color channels per pixel
      if (binaryMessage.length > maxCapacity) {
        resolve({ 
          success: false, 
          error: `Message too long. Max capacity: ${Math.floor(maxCapacity / 8)} characters` 
        });
        return;
      }

      // Embed message bits into LSB of RGB channels
      let bitIndex = 0;
      for (let i = 0; i < imageData.data.length && bitIndex < binaryMessage.length; i += 4) {
        // Skip alpha channel, only use RGB
        for (let channel = 0; channel < 3 && bitIndex < binaryMessage.length; channel++) {
          const pixelIndex = i + channel;
          const bit = parseInt(binaryMessage[bitIndex]);
          
          // Clear LSB and set new bit
          imageData.data[pixelIndex] = (imageData.data[pixelIndex] & 0xFE) | bit;
          bitIndex++;
        }
      }

      ctx?.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({ success: true, blob });
        } else {
          resolve({ success: false, error: "Failed to create image blob" });
        }
      }, 'image/png');
    };

    img.onerror = () => {
      resolve({ success: false, error: "Failed to load image" });
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Extract a hidden message from an image using LSB steganography
 */
export async function extractMessage(imageFile: File): Promise<SteganographyResult> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) {
        resolve({ success: false, error: "Failed to get image data" });
        return;
      }

      // Extract bits from LSB of RGB channels
      let binaryMessage = '';
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Extract from RGB channels only
        for (let channel = 0; channel < 3; channel++) {
          const pixelIndex = i + channel;
          const lsb = imageData.data[pixelIndex] & 1;
          binaryMessage += lsb.toString();
        }
      }

      // Convert binary to text and look for delimiter
      let extractedText = '';
      try {
        // Process in chunks to find the delimiter
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.substr(i, 8);
          if (byte.length === 8) {
            const char = String.fromCharCode(parseInt(byte, 2));
            extractedText += char;
            
            // Check if we've found the delimiter
            if (extractedText.includes(MESSAGE_DELIMITER)) {
              const message = extractedText.split(MESSAGE_DELIMITER)[0];
              if (message.length > 0) {
                resolve({ success: true, message });
                return;
              }
            }
          }
        }
        
        resolve({ success: false, error: "No hidden message found in this image" });
      } catch (error) {
        resolve({ success: false, error: "Failed to decode message from image" });
      }
    };

    img.onerror = () => {
      resolve({ success: false, error: "Failed to load image" });
    };

    img.src = URL.createObjectURL(imageFile);
  });
}

/**
 * Check if an image potentially contains a hidden message
 */
export async function hasHiddenMessage(imageFile: File): Promise<boolean> {
  const result = await extractMessage(imageFile);
  return result.success && result.message !== undefined && result.message.length > 0;
}