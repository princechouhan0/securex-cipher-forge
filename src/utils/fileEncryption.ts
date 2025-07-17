// File encryption utilities using Web Crypto API

export interface EncryptionResult {
  success: boolean;
  data?: ArrayBuffer;
  error?: string;
  salt?: Uint8Array;
  iv?: Uint8Array;
}

/**
 * Derive a key from password using PBKDF2
 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a file using AES-GCM
 */
export async function encryptFile(file: File, password: string): Promise<EncryptionResult> {
  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Derive key from password
    const key = await deriveKey(password, salt);
    
    // Read file as ArrayBuffer
    const fileData = await file.arrayBuffer();
    
    // Encrypt the file data
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      fileData
    );
    
    // Combine salt, iv, and encrypted data
    const result = new ArrayBuffer(16 + 12 + encryptedData.byteLength);
    const resultView = new Uint8Array(result);
    
    resultView.set(salt, 0);
    resultView.set(iv, 16);
    resultView.set(new Uint8Array(encryptedData), 28);
    
    return {
      success: true,
      data: result,
      salt,
      iv
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed'
    };
  }
}

/**
 * Decrypt a file using AES-GCM
 */
export async function decryptFile(encryptedFile: File, password: string): Promise<EncryptionResult> {
  try {
    // Read encrypted file as ArrayBuffer
    const encryptedData = await encryptedFile.arrayBuffer();
    
    if (encryptedData.byteLength < 28) {
      return {
        success: false,
        error: 'Invalid encrypted file format'
      };
    }
    
    // Extract salt, IV, and encrypted content
    const salt = new Uint8Array(encryptedData, 0, 16);
    const iv = new Uint8Array(encryptedData, 16, 12);
    const content = new Uint8Array(encryptedData, 28);
    
    // Derive key from password
    const key = await deriveKey(password, salt);
    
    // Decrypt the content
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      content
    );
    
    return {
      success: true,
      data: decryptedData,
      salt,
      iv
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed - wrong password or corrupted file'
    };
  }
}

/**
 * Get original file extension from encrypted filename
 */
export function getOriginalExtension(encryptedFileName: string): string {
  // Remove .enc extension and extract original extension
  const nameWithoutEnc = encryptedFileName.replace(/\.enc$/, '');
  const lastDotIndex = nameWithoutEnc.lastIndexOf('.');
  return lastDotIndex > 0 ? nameWithoutEnc.substring(lastDotIndex) : '';
}

/**
 * Determine MIME type from file extension
 */
export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.avi': 'video/x-msvideo',
    '.zip': 'application/zip',
    '.rar': 'application/x-rar-compressed',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript'
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
}