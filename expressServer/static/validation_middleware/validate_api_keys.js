if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
    console.log('loaded allowed API keys');
}

// copy the line below to import the validateAPI function in server.js
// const {validateAPI} = await import('./validation_middleware/validate_api_keys.js');

export async function validateAPI(req, res, next) {
    const allowedHeaders = ['quote-master-api-key', 'x5-quotemaster-api-key', 'dev-env-api-key'];

    console.log('validateAPI called');
   
    // read the values of the allowed headers present in the request
    const allowedHeadersValues = allowedHeaders.map(header => req.headers[header]);
    
    // clean up undefined values
    const apiKeyValues = allowedHeadersValues.filter(value => value);

    if(apiKeyValues.length === 0){
        console.log('No API key found in headers');
        res.status(401).json({ error: 'NoAPIKey', message: 'No API key found in headers' });
        return;
    }

    // get the first API key found in the headers - any call should have only one API key
    const apiKeyValue = apiKeyValues[0];
    
    const indexOfAllowedHeader = allowedHeadersValues.indexOf(apiKeyValue);
    if(indexOfAllowedHeader === -1){
        console.error('API key not allowed');
        res.status(401).json({ error: 'APIKeyNotAllowed', message: 'API key not allowed' });
        return;
    }

    const apiKey = allowedHeaders[indexOfAllowedHeader]
    console.log('apiKey in the request:', apiKey);

    //make all the leters capital and substitute - with _
    const apiKeyEnv = apiKey.toUpperCase().replace(/-/g, '_');

    if(apiKeyValue !== process.env[apiKeyEnv]){
        console.error('API key is not correct');
        res.status(401).json({ error: `InvalidAPI Key ${apiKey}`, message: 'API key is not correct' });
        return;
    }

    console.log(`API key ${apiKeyEnv} is correct`);

    next();
}
