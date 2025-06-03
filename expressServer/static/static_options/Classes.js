import { freshTokensObject, stages, selectionItems, desiredAvailability, timeZone, reasonForProviderNotBeConsidered } from './static_options.js';

class ShortestAvailability {
    constructor(){
        this.days= ''; // don't use zero here because the it can be same date service
        this.date = '';
        this.relativeDays= ''; // don't use zero here because the it can be same date service
        this.availability= ''; // unavailable, needToOrder, inStock
    };
};

class Quote {
    constructor(){
        this.price= 0; // this is the sum of the prices of all the itemsQuotes
        this.rate= 0; // this is the weighted average of the rates of all the itemsQuotes
        this.shortestAvailability= new ShortestAvailability(); // this is the worst shortestAvailability of all the itemsQuote
        this.brand= {tier: 0}; // this is the lowest tier of all the itemsQuotes (highest number)
        this.itemQuotesIndexes= []; //indexes to the item quotes in the provider
        this.completed= false; // this is true if all the itemQuotes are completed
        this.quoteReceivedAtTime = null; // this is the time when all the itemQuotes are completed
        this.mobileService= false; // true or false if the provider goes to the client
        this.bookingTime= {FIFO: '', time: ''}; // if FIFO true means that the provider takes clients in the order they arrive. if false, it needs to be scheduled
        this.affiliateId= ''; // this is the id of the provider that holds this quote
        this.dateOptions= [{date:'', time:''}, {date:'', time:''}]; // this is the list of dates that the provider can provide the service
    }
}; 

class Brand {
    constructor(){
        this.brandName= '';
        this.tier= 0;
    }
}

class ItemQuote {
    constructor(itemIndex=0){
        this.itemIndex= itemIndex; // this is the index of the item in the items array of the service order
        this.price= 0;
        this.shortestAvailability= new ShortestAvailability();
        this.brand= new Brand();
        this.stage = '';
        this.completed= false;
        this.presented= false;
        this.quoteReceivedAtTime = null; // this is the time when the quote was received
        this.substitutes = []; // this is a list of substitutes brands  for the item if it the brand is tier 3 
        this.outdated= false; // this is true if the quote is outdated
    }
};

class Item {
    constructor(){
        this.itemName= '';
        this.itemGroup= '';
        this.SKU= '';
    }
}

class Client {
    constructor(){
        this.clientName= '';
        this.clientPhoneNumber= '';
        this.LGPDaccepted= null;
    }
    fillUpClient(clientStandard){
        this.clientName= clientStandard.clientName;
        this.clientPhoneNumber= clientStandard.clientPhoneNumber;
        this.LGPDaccepted= clientStandard.LGPDaccepted;
        return this;
    }
}

class Automobile {
    constructor(){
        this.autoCategory= '';
        this.autoModel= '';
        this.autoYear= '';
        this.autoChassis= '';
        this.autoPlate= '';
    }
    fillUpAuto(autoStandard){
        this.autoCategory= autoStandard.autoCategory;
        this.autoModel= autoStandard.autoModel;
        this.autoYear= autoStandard.autoYear;
        this.autoChassis= autoStandard.autoChassis;
        this.autoPlate= autoStandard.autoPlate;
        return this;
    }
}


class Provider { // this is used for the provider inside the service order - the data structure for the provider by itself is different
    constructor(providerName, affiliateId){
        this.providerName= providerName || '';
        this.affiliateId= affiliateId || '';
        this.providerBestQuote= new Quote(); // this is the best quote for the provider. it is the best quote among all the stages
        this.conversation= [];
        this.reasignedBrands= []; // this is a list of brands to help in the conversation. The conversation goes in a way, but we need to use specific names for the brands
        this.timeOflastMessageSentToProvider= null; // this is the time for the next follow up
        this.phoneNumber= {countryCode: '', areaCode: '', number: ''};
        this.unformattedPhoneNumber= '';
        this.quoteViaLink= false;
        this.distanceFromClient= {km: 0, travelTimeInMinutes: 0, tollsInReais: 0};
        this.counterOfferSent= false;
        this.waitingResponse= false;
        this.itemQuotes= []; //initialItemQuoteObject - these are the quote for each item. they are used to calculate the providerBestQuote
        this.reasonsForProviderToNotBeConsidered= [];
        this.validWhatsapp= true;
        this.inputText= '';
        this.responsibles = {onCall: '', historic: []};
        this.link= '';
        this.fixPhoneNumberAttempts = 0;
        this.whatsappSource = {
            formattedSource: {countryCode: '', areaCode: '', number: ''},
            unformattedSource: '',
        };
    }
}



export { freshTokensObject, stages, selectionItems, desiredAvailability, timeZone, reasonForProviderNotBeConsidered, ShortestAvailability, Quote, Brand, ItemQuote, Item, Client, Automobile, Provider };