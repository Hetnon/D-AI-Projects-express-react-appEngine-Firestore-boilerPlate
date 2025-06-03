const nGrokUrl = 'https://tidy-enormously-piglet.ngrok-free.app';

export async function reRouteMessageToDevelopmentServer(serviceOrderId, affiliateId, message){
    // This function is used to re-route messages to the development server so we only need to use 1 address in the API call from X5
    // it's only called in the production environment - process.env.NODE_ENV === 'production' 
    try{
        console.log('reRouteMessageToDevelopmentServer called for serviceOrderId:', serviceOrderId, 'affiliateId:', affiliateId, 'message:', message);

        
        if(!nGrokUrl){
            console.error('nGrokUrl not found in reRouteMessageToDevelopmentServer');
            return false;
        }

        const payload = {
            serviceOrderId: serviceOrderId,
            affiliateId: affiliateId,
            message: message
        }

        const quoteMasterAPIKey = process.env.DEV_ENV_API_KEY; // comes from the secrets

        const url = nGrokUrl + '/api/redirected-service-provider-message';
        console.log('url in reRouteMessageToDevelopmentServer:', url)
        const body = JSON.stringify(payload);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'dev-env-api-key': quoteMasterAPIKey
            },
            body: body
        })

        if(response.status !== 200){ 
            console.error(`Status ${response.status} in reRouteMessageToDevelopmentServer:`, response.statusText)
            throw new Error(`Status ${response.status} in reRouteMessageToDevelopmentServer:`, response.statusText)
        }

        console.log('reRouteMessageToDevelopmentServer response:', response)
        return true;
    }
    catch (error){
        console.error('Error in reRouteMessageToDevelopmentServer:', error);
        throw new Error('Error in reRouteMessageToDevelopmentServer:', error);
    }
} 