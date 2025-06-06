import admin from 'firebase-admin';
import {firebaseKey} from '../secret_manager.js';
import {firestoreEmulatorUp} from './setupAndRun/runFirebase.js';
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

        _usersCollection = _db.collection('users');
        _errorCollection = _db.collection('errorCollection')
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
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        } else {
            // Load service account from local file in development
            await firestoreEmulatorUp(); // Ensure Firestore emulator is running
            // ② point every Admin-SDK call at the emulator
            process.env.GOOGLE_CLOUD_PROJECT   ||= 'demo-project';
            process.env.FIRESTORE_EMULATOR_HOST ||= 'localhost:8080';
            admin.initializeApp({projectId: process.env.GOOGLE_CLOUD_PROJECT});

        }

    }
}      