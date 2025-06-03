const timeZone = 'America/Sao_Paulo';

const stages = [ // update this list with the stages  - there are things missing here
    'notInitiated',
    1,
    2,
    3,
    'confirmToClose',
    'confirmFifoAndTime',
    'confirmDates',
    'fallbackToHuman',
    'closed'
];

const selectionItems = [
    {value: 'glasses', label: 'Vidros', WA_group: '01-VIDROS'},
    {value: 'accessories', label: 'Acessórios', WA_group: '04-ACESSÓRIOS'},
    {value: 'services', label:'Serviços', WA_group: 'REPARO RÁPIDO'},
    {value: 'services', label:'Serviços', WA_group: 'REPAROS'},
    {value: 'services', label:'Serviços', WA_group: 'SUPERMARTELINHO'},
    {value: 'services', label:'Serviços', WA_group: 'UNDER CAR'},
    {value: 'services', label:'Serviços', WA_group: 'MOTOR E CAMBIO'},
]

const reasonForProviderNotBeConsidered = [
    'noPhoneNumber',
    'noWhatsAppNumber',
    'invalidPhoneNumber',
    'noProviderName',
    'noAffiliateId'
]

const closeReasons = [
    {reasonCode:'quoteViaLink', description: 'Melhor Cotação foi via Link, sem interação com Afiliado' }, // best quote was received via link and the provider didn't respond or didn't have a whatsapp account, or an available source
    {reasonCode:'hitTheRequestedTarget', description: 'Afiliado alcançou o preço solicitado'  },// the provider hit the requested target - if this is stage 2, the target  is either maxRate or better. If this is stage 3, the target is the the minimum rate
    {reasonCode: 'stage3TimeRanOutAboveRealMinimumRate', description: 'Estágio 3 Timeout - Melhor Afiliado Acima da Nota Mínima'}, // this will only happen in the stage 3, as the time ran out and the best quote was below the real minimum rate 
    {reasonCode:'stage2CompleteAboveMinimumDesirableRate', description: 'Estágio 2 completo - Melhor Afiliado Acima da Nota Desejada' },// this will only happen in the stage 2, as the time ran out and the best quote was above the minimum desirable rate
    {reasonCode:'stage3CompleteAboveRealMinimumRate',description: 'Estágio 3 Completo - Melhor Afiliado Acima da Nota Mínima'}, // this will only happen in the stage 3, as the time ran out and the best quote was above the real minimum rate
]

const fallbackToHumanReasons = [
    {reasonCode: 'totalTimeOut', description: 'Tempo Total Esgotado sem Cotação Válida'},
    {reasonCode: 'invalidHashtags', description: 'Hashtags Inválidas'},
    {reasonCode: 'noProvidersToConsider', description: 'Nenhum Afiliado com WhatsApp Válido ou sem Canal Disponível'},
    { reasonCode: 'stage3CompleteBelowRealMinimumRate', description: 'Estágio 3 Completo - Melhor Cotação Abaixo da Nota Mínima'},
    {reasonCode: 'stoppedByUser', description: 'Usuário Interrompeu a Negociação'},
    {reasonCode: 'priceTooLow', description: 'Preço Muito Baixo. Verificar com Humano'},
    {reasonCode: 'bestProviderUnreachable', description: 'Melhor Afiliado sem WhatsApp Válido ou sem Canal Disponível'},
    {reasonCode: 'stage3CompleteInvalidBestQuote', description: 'Estágio 3 Completo - Nenhuma Cotação Válida'},
    {reasonCode: 'noValidQuotes', description: 'Nenhuma Cotação Válida Recebida'}

]

const freshTokensObject = {input: 0, output: 0};
const desiredAvailability = 7; // in days

const CNListInBrazil = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '21', '22', '24', '27', '28',
    '31', '32', '33', '34', '35', '37', '38',
    '41', '42', '43', '44', '45', '46', '47', '48', '49',
    '51', '53', '54', '55', '61', '62', '63', '64', '65', '66', '67', '68', '69',
    '71', '73', '74', '75', '77', '79',
    '81', '82', '83', '84', '85', '86', '87', '88', '89',
    '91', '92', '93', '94', '95', '96', '97', '98', '99'
];

export { freshTokensObject, stages, selectionItems, desiredAvailability, timeZone, reasonForProviderNotBeConsidered, closeReasons, fallbackToHumanReasons, CNListInBrazil};
