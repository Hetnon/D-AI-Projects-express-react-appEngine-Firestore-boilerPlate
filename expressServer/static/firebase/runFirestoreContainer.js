// ─── externalConnections/firestoreEmulator/firestoreEmulator.js ───
import { spawn, exec } from 'child_process';
import path from 'path';

const CONTAINER_NAME = 'firestore-emulator';

export async function firestoreEmulatorUp() {
    try {
		const dockerRunning = await isDockerRunning();
		if (!dockerRunning) {
			await startDockerDesktop();
			await new Promise(res => setTimeout(res, 10000)); // wait 10 seconds (adjust if needed)
			const dockerRunningAfterStart = await isDockerRunning();
			if (!dockerRunningAfterStart) {
				console.error('Docker is not running. Please start Docker Desktop.');
				return;
			}
		}

        const isRunning = await isFirestoreRunning();
        if (isRunning) {
            console.log('Firestore emulator already running. Skipping spawn…');
            return;
        }

        console.log('Firestore emulator not running. Spawning…');
        await runningFirebaseContainer();

		setInterval(async () => {
			await backupForFirestoreEmulator();
			console.log(`[${new Date().toISOString()}] Firestore export completed.`);
		}, 10 * 60 * 1000);

    } catch (err) {
        console.error('Error starting Firestore emulator:', err);
    }
}

/* ---------- helpers ------------------------------------------------------- */

function runCommand(cmd, cwd) {
	return new Promise((resolve, reject) => {
		exec(cmd, { cwd }, (error, stdout, stderr) => {
			if (error) return reject(error);
			resolve(stdout || stderr);
		});
	});
}

async function backupForFirestoreEmulator() {
	console.log('Starting Firestore export…');
	const composeDir = __dirname; // directory where the script AND docker-compose.yml live
	console.log(`[${new Date().toISOString()}] Triggering Firestore export...`);

	try {
		const stopOut = await runCommand('docker-compose stop firestore', composeDir);
		console.log(`Firestore container stopped: ${stopOut}`);

		await runningFirebaseContainer();
	} catch (error) {
		console.error(`Error during Firestore export: ${error.message}`);
	}
}

function isFirestoreRunning() {

    console.log('Checking if Firestore emulator is running…');
    return new Promise((resolve, reject) => {
        exec(
            `docker ps -q --filter name=${CONTAINER_NAME}`,
            (err, stdout) => {
                if (err) return reject(err);
                resolve(Boolean(stdout.trim())); // non-empty ⇒ running
            }
        );
    });
}

function isDockerRunning() {
    return new Promise((resolve) => {
        exec('docker info', (err) => {
            resolve(!err);
        });
    });
}

function startDockerDesktop() {
	const dockerDesktopPath = '"C:\\Program Files\\Docker\\Docker\\Docker Desktop.exe"';
    return new Promise((resolve, reject) => {
        console.log('Attempting to start Docker Desktop…');
        exec(`start "" ${dockerDesktopPath}`, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

function runningFirebaseContainer() {
        const workDir = __dirname
        const composeFile     = path.join(__dirname, 'docker-compose.yml');
        const composeCmdStr = ['compose','-f',composeFile,'up','--build', '-d']
        
        // Windows (cmd.exe) — same style as your ngrok helper
        return new Promise((resolve, reject) => {
                const child = spawnDocker(workDir, composeCmdStr);
                child.on('error', (err) => {
                        console.error('Error spawning new terminal:', err);
                        reject(err);
                });
                child.on('exit', (code) => {
                        if (code !== 0) {
                                console.error(`Firestore docker compose exited with code ${code}`);
                                reject(new Error(`Firestore docker compose exited with code ${code}`));
                        } else {
                                console.log('Firestore docker compose started successfully');
                                resolve();
                        }
                });
                
        });
}

function spawnDocker(workDir, args) {
        if (process.platform === 'win32') {
			console.log('Spawning docker compose in Windows');
			return spawn('docker', args, {cwd: workDir, stdio: 'inherit'});
        }

        // macOS / Linux (x-terminal-emulator fallback)
        return spawn('sh', ['-c', args], {
                cwd: workDir,
                detached: true,
                stdio: 'ignore'
        });

}