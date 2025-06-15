/**
 * Client-side encryption utilities for SoftoVault
 * Implements AES-256-GCM encryption for zero-knowledge architecture
 */

/**
 * Generate a random encryption key from user's access key
 * @param {string} accessKey - The vault access key
 * @returns {Promise<CryptoKey>} - Derived encryption key
 */
export async function deriveEncryptionKey(accessKey) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(accessKey),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Use a fixed salt for consistency (in production, consider storing salt per vault)
  const salt = encoder.encode('softovault-salt-2024');

  return await crypto.subtle.deriveKey(
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
 * Encrypt data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @param {CryptoKey} key - Encryption key
 * @returns {Promise<string>} - Base64 encoded encrypted data with IV
 */
export async function encryptData(plaintext, key) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  // Generate random IV for each encryption
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );
  
  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  // Return base64 encoded result
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt data using AES-256-GCM
 * @param {string} encryptedData - Base64 encoded encrypted data with IV
 * @param {CryptoKey} key - Decryption key
 * @returns {Promise<string>} - Decrypted plaintext
 */
export async function decryptData(encryptedData, key) {
  try {
    // Decode base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encrypted
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid access key or corrupted data.');
  }
}

/**
 * Encrypt vault metadata (title, description)
 * @param {Object} vaultData - Vault data to encrypt
 * @param {string} accessKey - Vault access key
 * @returns {Promise<Object>} - Encrypted vault data
 */
export async function encryptVaultData(vaultData, accessKey) {
  const key = await deriveEncryptionKey(accessKey);
  
  const encrypted = {
    ...vaultData,
    title: await encryptData(vaultData.title, key)
  };
  
  if (vaultData.description) {
    encrypted.description = await encryptData(vaultData.description, key);
  }
  
  return encrypted;
}

/**
 * Decrypt vault metadata
 * @param {Object} encryptedVaultData - Encrypted vault data
 * @param {string} accessKey - Vault access key
 * @returns {Promise<Object>} - Decrypted vault data
 */
export async function decryptVaultData(encryptedVaultData, accessKey) {
  const key = await deriveEncryptionKey(accessKey);
  
  const decrypted = {
    ...encryptedVaultData,
    title: await decryptData(encryptedVaultData.title, key)
  };
  
  if (encryptedVaultData.description) {
    decrypted.description = await decryptData(encryptedVaultData.description, key);
  }
  
  return decrypted;
}

/**
 * Encrypt secret data
 * @param {Object} secretData - Secret data to encrypt
 * @param {string} accessKey - Vault access key
 * @returns {Promise<Object>} - Encrypted secret data
 */
export async function encryptSecretData(secretData, accessKey) {
  const key = await deriveEncryptionKey(accessKey);
  
  const encrypted = {
    ...secretData,
    key: await encryptData(secretData.key, key),
    value: await encryptData(secretData.value, key)
  };
  
  if (secretData.description) {
    encrypted.description = await encryptData(secretData.description, key);
  }
  
  return encrypted;
}

/**
 * Decrypt secret data
 * @param {Object} encryptedSecretData - Encrypted secret data
 * @param {string} accessKey - Vault access key
 * @returns {Promise<Object>} - Decrypted secret data
 */
export async function decryptSecretData(encryptedSecretData, accessKey) {
  const key = await deriveEncryptionKey(accessKey);
  
  const decrypted = {
    ...encryptedSecretData,
    key: await decryptData(encryptedSecretData.key, key),
    value: await decryptData(encryptedSecretData.value, key)
  };
  
  if (encryptedSecretData.description) {
    decrypted.description = await decryptData(encryptedSecretData.description, key);
  }
  
  return decrypted;
}

/**
 * Decrypt multiple secrets
 * @param {Array} encryptedSecrets - Array of encrypted secrets
 * @param {string} accessKey - Vault access key
 * @returns {Promise<Array>} - Array of decrypted secrets
 */
export async function decryptSecrets(encryptedSecrets, accessKey) {
  const decryptedSecrets = [];
  
  for (const secret of encryptedSecrets) {
    try {
      const decrypted = await decryptSecretData(secret, accessKey);
      decryptedSecrets.push(decrypted);
    } catch (error) {
      console.error('Failed to decrypt secret:', secret.id, error);
      // Skip corrupted secrets but continue with others
    }
  }
  
  return decryptedSecrets;
}