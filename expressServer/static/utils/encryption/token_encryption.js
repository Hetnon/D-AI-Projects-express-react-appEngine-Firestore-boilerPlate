
import crypto from 'crypto';
const algorithm = 'aes-256-ctr';

if (process.env.NODE_ENV !== 'production') {
    console.log('setting dotenv in token_encryption')
    require('dotenv').config();
}

const secretKey = process.env.ENCRYPTION_KEY; // Ensure this is a 32-byte key
const key = Buffer.from(secretKey, 'hex');


export function encryptToken(token){
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const ivHex = iv.toString('hex');
    return ivHex + encrypted; // Prepend IV to the encrypted data
};

export function decryptToken(encrypted){
    if(encrypted === null || encrypted === undefined){
        return null;
    }
    const iv = Buffer.from(encrypted.substring(0, 32), 'hex'); // Extract the first 16 bytes (32 hex characters) as IV
    const encryptedData = encrypted.substring(32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export function createUniquePasswordResetToken() {
    const resetToken = crypto.randomBytes(64).toString('hex');

    return resetToken
}    

