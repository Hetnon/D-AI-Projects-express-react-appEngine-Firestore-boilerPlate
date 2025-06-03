

const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');
// Load the .env file


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const secretKey = process.env.ENCRYPTION_KEY;

const crypto = require('crypto');
const key = Buffer.from(secretKey, 'hex');
const algorithm = 'aes-256-ctr';

function decryptToken(encrypted){
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

// get token from the command line
const token = process.argv[2];
// load the secret key from the .env file
console.log('decrypting token:', token)
const decryptedToken = decryptToken(token);
console.log('decrypted token:', decryptedToken)
