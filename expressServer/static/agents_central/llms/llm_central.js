import {openAiCompletions} from './open_ai/open_ai_completions.js';
import {anthropicMessages} from './anthropic/anthropic_messages.js';


const openAIModels = [
    {name: 'gpt-3.5-turbo-0125', family: 'gpt'},
    {name: 'gpt-4-0125-preview', family: 'gpt'},
    {name: 'gpt-4-turbo-2024-04-09', family: 'gpt'},
    {name: 'gpt-4o-mini-2024-07-18', family: 'gpt'},
    {name: 'gpt-4o-2024-05-13', family: 'gpt'},
    {name: 'gpt-4o-2024-08-06', family: 'gpt'},
    {name: 'o3-mini-2025-01-31', family: 'o'},
    {name: 'o1-mini-2024-09-12', family: 'o'},
    {name: 'o1-2024-12-17', family: 'o'},
];

const anthropicModels = [
    {name: 'claude-3-sonnet-20240229', family: 'claude'},
    {name: 'claude-3-opus-20240229', family: 'claude'},
    {name: 'claude-3-haiku-20240307', family: 'claude'},
    {name: 'claude-3-5-sonnet-20240620', family: 'claude'},
    {name: 'claude-3-7-sonnet-20250219', family: 'claude'}
];

const metaModels = [
    'llama-3.2-90b-vision-instruct-maas',
    'llama3-70b-instruct-maas',
    "meta/llama-3.1-405b-instruct-maas"
]

const models = [...openAIModels, ...anthropicModels, ...metaModels];

export async function llmReturn(message, model, temperature){
    if(!models.find(modelObj => modelObj.name === model)){
        console.error(`llmReturn Error: Invalid model ${model}`);
        throw new Error('llmReturn Error:: Invalid model');
    }
    const openAIModel = openAIModels.find(modelObj => modelObj.name === model);
    if(openAIModel){
        return openAiCompletions(message, openAIModel, temperature);
    } 
    
    const anthropicModel = anthropicModels.find(modelObj => modelObj.name === model);
    if(anthropicModel){
        return anthropicMessages(message, anthropicModel);
    }
    //  } else if(metaModels.includes(model)){
    //     return metaMessages(message, model);
    // }
};