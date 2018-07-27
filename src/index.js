'use strict';

import Alexa from 'ask-sdk-core'
import TriMetAPI from 'trimet-api-client'
import SpeechHelper from './utils/SpeechHelper'

const INVOCATION_NAME = process.env.INVOCATION_NAME || "Portland Bus";
const APP_ID = process.env.APP_ID;
const triMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

// Note: these functions can't be ES6 arrow functions; "this" ends up undefined if you do that.
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speechText = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus stops in Portland, Oregon. Which stop would you like information about?`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        let speechOutput = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus stops in Portland, Oregon. Which stop would you like information about?`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};

const CancelIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent')
    },
    handle(handlerInput) {
        const speechText = 'Okay';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};

const StopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent')
    },
    handle(handlerInput) {
        const speechText = 'Goodbye';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};

const GetBusIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'GetBusIntent')
    },
    handle(handlerInput) {
        let slots = this.event.request.intent.slots;
        let busId = parseInt(slots.BusID.value);

        if(isNaN(busId)){
            let speechText = "Sorry, I was not able to find information about that bus.";
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard(INVOCATION_NAME, speechText)
                .getResponse();
        }

        let speechText = `I can get information about bus ${busId} for you. ${repromptText}`;
        let repromptText = "Which stop would you like to know about?";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};

const GetSingleNextArrivalIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'GetSingleNextArrivalIntent')
    },
    handle(handlerInput) {
        let slots = this.event.request.intent.slots;
        let busId = parseInt(slots.BusID.value);

        if(isNaN(busId)){
            let speechText = "Sorry, I was not able to find information about that bus.";
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard(INVOCATION_NAME, speechText)
                .getResponse();
        }

        let speechText = `I can get information about bus ${busId} for you. ${repromptText}`;
        let repromptText = "Which stop would you like to know about?";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};


// Todo: implement this
const GetAllNextArrivalsIntent = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'GetBusIntent')
    },
    handle(handlerInput) {
        let slots = this.event.request.intent.slots;
        let busId = parseInt(slots.BusID.value);

        if(isNaN(busId)){
            let speechText = "Sorry, I was not able to find information about that bus.";
            return handlerInput.responseBuilder
                .speak(speechText)
                .withSimpleCard(INVOCATION_NAME, speechText)
                .getResponse();
        }

        let speechText = `I can get information about bus ${busId} for you. ${repromptText}`;
        let repromptText = "Which stop would you like to know about?";
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(INVOCATION_NAME, speechText)
            .getResponse();
    }
};


const handlers = {

    'GetAllNextArrivalsIntent': function(){
        let slots = this.event.request.intent.slots;
        let stopId = parseInt(slots.StopID.value);

        if(isNaN(stopId)){
            console.error(`ERROR: stopId is NaN.`);
            this.emit(':tell', "Sorry, I was not able to find information about that stop.");
            return;
        }

        triMetAPIInstance.getSortedFilteredArrivals(stopId)
            .then(arrivals => {
                let responseText = SpeechHelper.buildArrivalsResponse(stopId, arrivals);
                this.emit(':tell', responseText);
                return;
            })
            .catch(err => {
                console.error(err);
                this.emit(':tell', `Sorry, an error occurred retrieving arrival times for stop ${stopId}.`);
                return;
            });
    }
};

exports.handler = (event, context, callback) => {
    let alexa = Alexa.handler(event, context);
    // Only set appId if not debugging
    if ('undefined' === typeof process.env.DEBUG) {
        alexa.appId = APP_ID;
    }
    alexa.registerHandlers(handlers);
    alexa.execute();
};