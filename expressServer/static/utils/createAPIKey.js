import { encryptToken } from './token_encryption.js';
const newAPIKey = '123456';
console.log('newAPIKey', newAPIKey);
console.log('encryptToken(newAPIKey)', encryptToken(newAPIKey));