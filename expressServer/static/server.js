
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import https from 'https';
import fs from 'fs';
import path  from 'path';
import firestoreStoreFactory from 'firestore-store';
import {loadSecrets} from './secret_manager.js';
import cookieParser from 'cookie-parser';
import { ngrokConnection } from './externalConnections/ngrok/ngrokConnection.js'

const app = express();
app.use(cookieParser());  // This parses cookies and populates `req.cookies`
const FirestoreStore = firestoreStoreFactory(session);
let server;
let sessionName;
let io;

(async () => { // Load secrets from Secret Manager in production and local keys for development
    try{

        if (process.env.NODE_ENV === 'production') {
            await startProductionConfigurations();
        } else{// Development environment
            await startDevelopmentConfigurations();
        }
        setupCORS();
        app.use(bodyParser.json());

        // 
        const {initializeAllFirebase, getFirebaseDB} = await import('./firebase/firebase_apis.js');
        await initializeAllFirebase();

        app.get('/', (req, res) => {
            console.log('root working');// Check if your application is ready (e.g., database connections are established)      
            res.status(200).send('root working OK');  // If ready, respond with a 200 OK status
        });
        app.get('/readiness_check', (req, res) => {
            res.status(200).send(' reainess check ok');  // If ready, respond with a 200 OK status
        });
        app.get('/liveness_check', (req, res) => {
            res.status(200).send('liveness check ok');
        });

        const db = getFirebaseDB();
        const store = new FirestoreStore({
            database: db,
            kind: sessionName
        });

        const sessionConfig = createSessionConfig(store, sessionName);

        app.use(session(sessionConfig)); // Initialize session middleware


        const {userLogin, passwordChange, passwordResetRequest, passwordResetConfirmation} = await import('./user_management/user_management_by_users.js');
        const {terminateSession} = await import('./user_session_init.js');
        const {createUser, getUsersList, deleteUser, changeUserStatus} = await import('./user_management/user_management_by_admins.js');
        const {validateAPI} = await import('./validation_middleware/validate_api_keys.js');
        const {validateUser, checkUserSession} = await import('./validation_middleware/validate_user.js');

        // User Management Calls By Users
        app.post('/api/user-login', userLogin);
        app.get('/api/check-user-session', checkUserSession);
        app.patch('/api/password-change', passwordChange);
        app.post('/api/password-reset-request', passwordResetRequest);
        app.post('/api/password-reset-confirmation', passwordResetConfirmation);

        //Session Management Calls by User
        app.post('/api/terminate-session', validateUser('terminateSession'), (req, res) => {
            terminateSession(req, res, io);
        });

        // User Management Calls By Admins
        app.get ('/api/get-users-list', validateUser('getUsersList'), getUsersList);
        app.post('/api/create-user', validateUser('createUser'), createUser);
        app.patch('/api/change-user-status', validateUser('changeUserStatus'), changeUserStatus);
        app.delete('/api/delete-user/:userEmail', validateUser('deleteUser'), deleteUser);

        // Start the server
        startServer();

    } catch (error) {
        console.error("Error during server initialization:", error);
    }

})();

async function startProductionConfigurations(){
    console.log('production environment');
    app.set('trust proxy', 1);
    await loadSecrets(); // Load secrets from Secret Manager in production
    console.log('secrets loaded');
    sessionName = 'production-session';
}

async function startDevelopmentConfigurations(){
    console.log('Development environment');
    const dotenv = await import('dotenv');
    dotenv.config();
    await ngrokConnection(process.env.PORT, process.env.RESERVED_NGROK_DOMAIN, process.env.NGROK_AUTH_TOKEN);
    sessionName = 'dev-session';	
    const key = fs.readFileSync(path.join(__dirname, '..', 'keys', 'security_certificate', 'localhost-key.pem'));
    const cert = fs.readFileSync(path.join(__dirname, '..','keys', 'security_certificate', 'localhost.pem'));
    server = https.createServer({
        key: key,
        cert: cert
    }, app);
}

function startServer(){
    if (process.env.NODE_ENV === 'production') {
        server = app.listen(process.env.PORT_TO_USE, '0.0.0.0', () => {
            console.log(`Production Server Initated'`);
        })
    } else {
        const PORT = process.env.PORT || 3030;
        server.listen(PORT, () => {
            console.log(`Dev Server Initated`);
        });
    }
}

function setupCORS(){
    console.log('setting up CORS');
    const allowedOrigins = [
        process.env.ALLOWED_ORIGIN,
    ];

    app.use(cors({
        origin: function (origin, callback) {
            let mobileTestOrigin = false;
            if(process.env.NODE_ENV!== 'production' && origin) {
                mobileTestOrigin = origin.startsWith('https://10.15.') 
            }

            const isOriginAllowed = allowedOrigins.includes(origin);
            
            if (!origin || mobileTestOrigin || isOriginAllowed) {
              callback(null, true)
            } else {
                console.log('Incoming http request from not allowed origin:', origin);
                callback(new Error(`${origin} not allowed by CORS`))
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'quote-master-api-key', 'x5-quoteMaster-api-key'],
        optionsSuccessStatus: 204,
        credentials: true
    }));
}

function createSessionConfig(store, sessionName){
    return  {
        name: sessionName,
        store: store,
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        cookie: { 
            httpOnly: true,
            path: '/',
            secure: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),  // expires in 30 days
        }
    };
}

