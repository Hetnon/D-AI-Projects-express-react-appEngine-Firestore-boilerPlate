import admin from 'firebase-admin';
import {firebaseKey} from '../secret_manager.js';

let _db;
let _usersCollection;
let _errorCollection;
export const FieldValue = admin.firestore.FieldValue;

export function getFirebaseDB(){
    if (!_db) {
        throw new Error('Firestore has not been initialized. Call initializeAllFirebase first.');
    }
    return _db;
}
export function getUsersCollection() {
    if (!_usersCollection) {
        throw new Error('Users collection has not been initialized. Call initializeAllFirebase first.');
    }
    return _usersCollection;
}
export function getErrorCollection() {
    if (!_errorCollection) {
        throw new Error('Error collection has not been initialized. Call initializeAllFirebase first.');
    }
    return _errorCollection;
}


export async function initializeAllFirebase(){
    try{
        console.log('Initializing Firestore')
        await initializeFirebase();
        _db = admin.firestore();
        _db.settings({
            ignoreUndefinedProperties: true
        });

        _usersCollection = _db.collection('quoteMasterUsers');

        if (process.env.NODE_ENV === 'production'){
            _errorCollection = _db.collection('errorCollection')
        } else if (process.env.NODE_ENV === 'development'){
            _errorCollection = _db.collection('errorCollectionDev')
        }

        console.log('Firestore initialized');
        return;
    } catch (error){
        console.error('Error in initializeAllFirebase:', error);
    }
};

async function initializeFirebase() {
    if (!admin.apps.length) {
        let serviceAccount;
        if (process.env.NODE_ENV === 'production') {
            serviceAccount = await firebaseKey(); // Load secrets from Secret Manager in production
        } else {
            // Load service account from local file in development
            const module = await import('../../keys/firebase-adminsdk.json');            
            serviceAccount = module.default;
        }
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    }
}


       
            