import { spawn, exec } from 'child_process';

export async function ngrokConnection(port, reservedNgrokDomain, authToken) {
    try {
        const isRunning = await isNgrokRunning();
        if (isRunning) {
            console.log('ngrok is already running. Skipping spawn...');
            return;
        }
        console.log('ngrok is not running. Spawning...');
        spawnNgrokInNewTerminal(port, reservedNgrokDomain, authToken);

        console.log('ngrok is live at:', reservedNgrokDomain);
    } catch (error) {
        console.error('Error starting ngrok:', error);
    }
}

function isNgrokRunning() {
    return new Promise((resolve, reject) => {
      exec('tasklist', (err, stdout) => {
        if (err) {
          return reject(err);
        }
        // If "ngrok.exe" is found in the process list, return true
        resolve(stdout.toLowerCase().includes('ngrok.exe'));
      });
    });
}

export function spawnNgrokInNewTerminal(port, reservedDomain, authToken) {
    // This command will open a new cmd window,
    // run `npx ngrok http 3030` and keep it open.
    const localAddress = `https://localhost:${port}`;
    spawn('cmd.exe', [
      '/c',          // /c = run the following command
      'start',       // start = launch a new window
      'cmd.exe',     // open a new cmd shell
      '/k',          // /k = keep it open after command completes
      'npx',
      'ngrok',
      'http',
      '--domain', reservedDomain,
      localAddress,
    ], {
      // Use `shell: true` so Windows can interpret `cmd.exe` commands
      shell: true,
      // `detached: true` means the new process isn’t tied to this parent’s lifecycle
      detached: true,
      stdio: 'ignore', 
    });
}