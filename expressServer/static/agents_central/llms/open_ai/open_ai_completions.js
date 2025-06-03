import OpenAI from "openai";

let OPENAI_API_KEY;
if (process.env.NODE_ENV !== 'production') {
    console.log('setting dotenv in open_ai_completions')
    require('dotenv').config();
    OPENAI_API_KEY= process.env.OPEN_AI_API_KEY_CARGLASS;
} else {
    OPENAI_API_KEY= process.env.OPEN_AI_API_KEY_CARGLASS;
}

export const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});


export async function openAiCompletions(message, model, temperature = 0.01){
    
    const data = {
        model: model.name, 
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
        messages: [
            {
            role: "user",
            content: message 
            }
        ],


    };
    if(model.family==='gpt'){
        data.max_tokens= 4096
        data.temperature= temperature
    } else if(model.family==='o'){
        data.max_completion_tokens= 4096
    }

    try {
        const response = await openai.chat.completions.create(data);
        const outputTokens = response.usage.completion_tokens;
        const inputTokens = response.usage.prompt_tokens;
        const agentMessage = response.choices[0].message.content;
        const cachedTokens = response.usage.prompt_tokens_details.cached_tokens;


        return {agentMessage: agentMessage, outputTokens: outputTokens, inputTokens: inputTokens, cachedTokens: cachedTokens};
    } catch (error) {
        console.error('Error on openAiCompletions call', error);
        throw error;
    }
  
  };


