
// Steganography utility functions for LSB encoding/decoding

export interface SteganographyResult {
  success: boolean;
  message?: string;
  error?: string;
}

export class SteganographyProcessor {
  private static readonly DELIMITER = '\0\0\0\0'; // End marker for messages

  // Convert string to binary
  private static stringToBinary(text: string): string {
    return text
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
  }

  // Convert binary to string
  private static binaryToString(binary: string): string {
    const chars = binary.match(/.{8}/g) || [];
    return chars
      .map(byte => String.fromCharCode(parseInt(byte, 2)))
      .join('');
  }

  // Embed message in image using LSB
  static embedMessage(imageData: ImageData, message: string): ImageData {
    const messageWithDelimiter = message + this.DELIMITER;
    const binaryMessage = this.stringToBinary(messageWithDelimiter);
    const data = new Uint8ClampedArray(imageData.data);
    
    console.log('Embedding message:', message);
    console.log('Binary length:', binaryMessage.length);
    
    let bitIndex = 0;
    
    // Embed message bits in LSB of RGB channels (skip alpha)
    for (let i = 0; i < data.length && bitIndex < binaryMessage.length; i += 4) {
      // Process R, G, B channels (skip A at i+3)
      for (let channel = 0; channel < 3 && bitIndex < binaryMessage.length; channel++) {
        const pixelIndex = i + channel;
        const bit = parseInt(binaryMessage[bitIndex]);
        
        // Clear LSB and set new bit
        data[pixelIndex] = (data[pixelIndex] & 0xFE) | bit;
        bitIndex++;
      }
    }
    
    console.log('Embedded', bitIndex, 'bits');
    
    return new ImageData(data, imageData.width, imageData.height);
  }

  // Extract message from image using LSB
  static extractMessage(imageData: ImageData): SteganographyResult {
    const data = imageData.data;
    let binaryMessage = '';
    
    console.log('Extracting from image data, size:', data.length);
    
    // Extract LSBs from RGB channels
    for (let i = 0; i < data.length; i += 4) {
      // Process R, G, B channels (skip A at i+3)
      for (let channel = 0; channel < 3; channel++) {
        const pixelIndex = i + channel;
        const lsb = data[pixelIndex] & 1;
        binaryMessage += lsb.toString();
        
        // Check if we have enough bits to check for delimiter
        if (binaryMessage.length >= 32 && binaryMessage.length % 8 === 0) {
          const currentMessage = this.binaryToString(binaryMessage);
          if (currentMessage.includes(this.DELIMITER)) {
            const extractedMessage = currentMessage.split(this.DELIMITER)[0];
            console.log('Found delimiter, extracted message:', extractedMessage);
            
            if (extractedMessage.length > 0) {
              return {
                success: true,
                message: extractedMessage
              };
            }
          }
        }
        
        // Prevent infinite extraction
        if (binaryMessage.length > 10000) {
          break;
        }
      }
      
      if (binaryMessage.length > 10000) {
        break;
      }
    }
    
    console.log('No valid message found, binary length:', binaryMessage.length);
    
    return {
      success: false,
      error: "No hidden message found in this image"
    };
  }

  // Check if image has enough capacity for message
  static checkCapacity(imageData: ImageData, message: string): boolean {
    const messageWithDelimiter = message + this.DELIMITER;
    const requiredBits = this.stringToBinary(messageWithDelimiter).length;
    const availableBits = (imageData.width * imageData.height * 3); // RGB channels only
    
    return requiredBits <= availableBits;
  }
}
