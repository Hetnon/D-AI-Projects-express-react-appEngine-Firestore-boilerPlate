import {GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

let PROJECT_ID;
let vertexAItoken;

async function setVertexAItoken(keys){
    vertexAItoken = await getGCloudToken(keys);
    setTimeout(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('calling setVertexAItoken again')
            const keyPath = path.join(__dirname, '../../../../keys/vertex-ai-key'); // define new json key for vertex ai service account
            keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
            console.log('keys inside setTimeout', keys?.type);        
            setVertexAItoken(keys);
        } else {
            setVertexAItoken(null);
        }
    }, 3300000); // 55 minutes 
}

async function getGCloudToken(keys) {
    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        });
        let client;
        console.log('keys inside getGCloudToken', keys?.type);
        if(keys){ // if keys are passed, use them to authenticate
            client = auth.fromJSON(keys);
        } else { // if keys are not passed means we are in the prod enviroment, already inside google app engine/google cloud project, use the default authentication
            client = await auth.getClient();
        }
        return await client.getAccessToken();
    } catch (error) {
        console.error('Error in getGCloudToken:', error);
        return null;
    }
}

if (process.env.NODE_ENV !== 'production') {
    console.log('setting dotenv in meta_models')
    require('dotenv').config();
    PROJECT_ID= process.env.GOOGLE_PROJECT_ID;
    const keyPath = path.join(__dirname, '../../../../keys/vertex-ai-key.json'); // define new json key for vertex ai service account
    const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    setVertexAItoken(keys);
} else {
    PROJECT_ID= process.env.GOOGLE_PROJECT_ID;
    setVertexAItoken(null);
}

export async function metaMessages(message, model){
    const body = {
        model: model,
        stream: false,
        messages: [
            {
                role: "user",
                content: message
            }
        ]
    };
    const location = 'us-central1';
  
    try {
        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${location}/endpoints/openapi/chat/completions`
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${vertexAItoken.token}`,
            },
            body:JSON.stringify(body),
        })

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}, details: ${errorDetails}`);
        }

        const responseJson = await response.json();
        const outputTokens = responseJson.usage.completion_tokens;
        const inputTokens = responseJson.usage.prompt_tokens;
        const agentMessage = responseJson.choices[0].message.content;


        return {agentMessage: agentMessage, outputTokens: outputTokens, inputTokens: inputTokens};
    } catch (error) {
        console.error('Error on metaMessages call', error);
        throw error;
    }
  
};


