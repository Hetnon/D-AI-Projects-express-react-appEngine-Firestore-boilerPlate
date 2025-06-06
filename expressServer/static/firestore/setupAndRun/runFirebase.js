// ─── externalConnections/firestoreEmulator/firestoreEmulator.js ───
import { spawn, exec } from 'child_process';
import path from 'path';
let saveInterval = null;
const pathToFirebaseRoot = path.resolve(__dirname, '.');

export async function firestoreEmulatorUp() {
    try {
        // check if childProcess is not an error
        if (await checkFirestoreReady()) {
            setTimedSavesForFirestoreEmulator();
            console.log('Firestore emulator already running. Skipping spawn…');
            return;
        }
        console.log('Firestore emulator not running. Spawning…');
        await spawnFirebase();
        setTimedSavesForFirestoreEmulator();
    } catch (err) {
        console.error('Error starting Firestore emulator:', err);
    }
}

async function spawnFirebase() {
    console.log('pathToFirebaseRoot:', pathToFirebaseRoot);
    const cmdLine = `cd /d "${pathToFirebaseRoot}" && firebase emulators:start --project=demo-project --import=./firebase-data`;
    const args = [
        '/c',
        'start',
        '""', // Empty title is important
        'cmd',
        '/k',
        `"${cmdLine}"`
    ];   

    spawn('cmd.exe', args, {
        shell: true,
        detached: true,
        stdio: 'ignore'
    });
    console.log('Spawned Firebase emulator in a new terminal window');
    await waitUntilFirestoreIsReady();
}

function waitUntilFirestoreIsReady(timeout = 15000, interval = 1000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const waitFirestoreReady = async () => {
            if(await checkFirestoreReady()){
                console.log('Firestore emulator is ready');
                return resolve();
            }
            if (Date.now() - start > timeout) {
                console.error('Timeout waiting for Firestore emulator to be ready');
                return reject(new Error('Firestore emulator not ready within timeout'));
            }
            setTimeout(waitFirestoreReady, interval);
        };
        waitFirestoreReady();
    });
}

function checkFirestoreReady() {
    return new Promise((resolve) => {
        exec('wmic process where "name=\'java.exe\'" get CommandLine', (err, stdout) => {
            if (err || !stdout) {
                console.error('Error checking Firestore emulator process:', err);
                return resolve(false);
            }
            const isReady = stdout.toLowerCase().includes('cloud-firestore-emulator-v1.19.8.jar --host 0.0.0.0 --port 8080');
            resolve(isReady);
        })
    });
}
        
function setTimedSavesForFirestoreEmulator() {
    if(saveInterval) {
        clearInterval(saveInterval);
    }
    const saveIntervalMs = 1000 * 60 * 5; 
    console.log('Setting timed saves for Firestore emulator every', saveIntervalMs / 1000, 'seconds');
    
    saveInterval = setInterval(() => {
        exec('firebase emulators:export ./firebase-data --force --project=demo-project', 
            {cwd: pathToFirebaseRoot, shell: true},
            (err, stdout, stderr) => {
            if (err) {
                console.error('Error saving Firestore emulator data:', err);
            }
        });
    }, saveIntervalMs);
}