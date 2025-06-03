import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();
const projectName = process.env.PROJECT_ID;

export async function loadSecrets() {
    console.log('Loading secrets from Secret Manager')
    try {
        const [version] = await client.accessSecretVersion({
            name: `projects/${projectName}/secrets/env_secrets/versions/latest`
        });

        const payload = version.payload.data.toString('utf8');
        const envSecrets = JSON.parse(payload);

        for (const [key, value] of Object.entries(envSecrets)) {
            process.env[key] = value;
        }
        console.log('Secrets loaded successfully.');
    } catch (error) {
        console.error('Failed to load secrets:', error);
    }
}

export async function firebaseKey() {
    try{
        const [version] = await client.accessSecretVersion({
            name: `projects/${projectName}/secrets/FIREBASE_CONFIG/versions/latest`
        });
        const payload = version.payload.data.toString('utf8');
        return JSON.parse(payload);
    } catch (error){
        console.error('Error in firebaseKey():', error);
    }
}