let CLAUDE_API_KEY
if (process.env.NODE_ENV !== 'production') {
    console.log('setting dotenv in anthropic_messages')
    require('dotenv').config();
    CLAUDE_API_KEY= process.env.ANTHROPIC_API_KEY_CARGLASS;
} else{
    CLAUDE_API_KEY= process.env.ANTHROPIC_API_KEY_CARGLASS;
}


import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: CLAUDE_API_KEY, // defaults to process.env["ANTHROPIC_API_KEY"]
  });


export async function anthropicMessages(message, model){
    const messages = [
        {
            role: "user",
            content: message
        }
    ];
    console.log('anthropicMessages called for model:', model);
  
    try {
        const response = await anthropic.messages.create({
            model: model.name,
            max_tokens: 1024,
            messages: messages,
            temperature: 0,
          });
          if(!response.type || response.type !== 'message'){
            console.error('Error on anthropicMessages call', response);
            return{agentMessage: '', outputTokens: [], inputTokens: []};
          }
        const agentMessage = response.content.length > 0 ? response.content[0].text : '';
        const outputTokens = response.usage.output_tokens;
        const inputTokens = response.usage.input_tokens;
        return {agentMessage: agentMessage, outputTokens: outputTokens, inputTokens: inputTokens};
    } catch (error) {
        console.error('Error on anthropicMessages call', error);
        throw error;
    }
  };

