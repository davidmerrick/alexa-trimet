'use strict';

import Alexa from 'alexa-sdk'
import TriMetAPI from 'trimet-api-client'
import SpeechHelper from './utils/SpeechHelper'

const INVOCATION_NAME = process.env.INVOCATION_NAME || "Portland Bus";
const APP_ID = process.env.APP_ID;
const triMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

// Note: these functions can't be ES6 arrow functions; "this" ends up undefined if you do that.
const handlers = {
    'LaunchRequest': function(){
        let speechOutput = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus and train stops in Portland, Oregon.`;
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function(){
        let speechOutput = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus and train stops in Portland, Oregon.`;
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function(){
        let speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function(){
        let speechOutput = "Okay";
        this.emit(':tell', speechOutput);
    },
    'GetSingleNextArrivalIntent': function(){
        let slots = this.event.request.intent.slots;
        let stopId = slots.StopID.value;
        let busId = slots.BusID.value;
        SpeechHelper.singleNextArrivalResponse(triMetAPIInstance, stopId, busId);
    },
    'GetAllNextArrivalsIntent': function(){
        let slots = this.event.request.intent.slots;
        let stopId = slots.StopID.value;
        SpeechHelper.allNextArrivalsResponse(triMetAPIInstance, stopId)
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