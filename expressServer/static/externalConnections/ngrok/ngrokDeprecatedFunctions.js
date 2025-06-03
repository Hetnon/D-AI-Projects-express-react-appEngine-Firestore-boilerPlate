
// This is deprecated, but kept for reference - now we use a fixed reserved domain
async function pollNgrokUrl(port = 3030) {
    const maxAttempts = 10;
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(1000); // 1 second
      try {
        const url = await getNgrokUrlForPort(port);
        if (url) {
          return url;
        }
      } catch (err) {
        // ignore, keep looping
      }
    }
    throw new Error(`Could not find an ngrok tunnel for port ${port} after ${maxAttempts} attempts`);
}
import { updateNgrokUrl } from './ngrok_url_management.js';

async function getNgrokUrlForPort(port) {
    // Hits ngrok's admin API to get all tunnels, finds the one for our port
    const response = await fetch('http://127.0.0.1:4040/api/tunnels');
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
  
    // data.tunnels is an array of objects
    // Each tunnel object has { name, public_url, proto, config: { addr }, ... }
    const tunnel = data.tunnels.find(t => {
      // The config.addr might be "http://localhost:3030" or "localhost:3030"
      // so you can check partial matches if needed
      return t.config.addr.includes(port.toString());
    });
  
    return tunnel ? tunnel.public_url : null;
  }
  
  // Simple sleep helper
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  import { nGrokUrlCollection } from "../../firebase/firebase_apis.js";

export async function updateNgrokUrl(url){ 
    try{
        const nGrokDoc = await nGrokUrlCollection.doc('nNgrokUrl')
        if(!nGrokDoc){
            console.log('nGrokDoc not found');
            // create the document
            await nGrokUrlCollection.doc('nNgrokUrl').set({url: url});
        } else {
            await nGrokDoc.update({url: url});
        }
        console.log('Ngrok url set');
    } catch (error){
        console.error('Error in updateNgrokUrl:', error);
    }

}

export async function returnNgrokUrl(){
    try{
        const nNgrokUrl = await nGrokUrlCollection.doc('nNgrokUrl').get().then(doc=>doc.data().url);
        return nNgrokUrl;
    } catch (error){
        console.error('Error in returnNgrokUrl:', error);
    }
}