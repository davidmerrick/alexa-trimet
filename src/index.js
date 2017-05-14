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
        let speechOutput = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus stops in Portland, Oregon. Which stop would you like information about?`;
        this.emit(':ask', speechOutput, "Which stop would you like information about?");
    },
    'AMAZON.HelpIntent': function(){
        let speechOutput = `Welcome to ${INVOCATION_NAME}. I can retrieve arrival times for bus stops in Portland, Oregon. Which stop would you like information about?`;
        this.emit(':ask', speechOutput, "Which stop would you like information about?");
    },
    'AMAZON.StopIntent': function(){
        let speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.CancelIntent': function(){
        let speechOutput = "Okay";
        this.emit(':tell', speechOutput);
    },
    'GetBusIntent': function(){
        let slots = this.event.request.intent.slots;
        let busId = parseInt(slots.BusID.value);

        if(isNaN(busId)){
            this.emit(':tell', "Sorry, I was not able to find information about that bus.");
            return;
        }

        let repromptText = "Which stop would you like to know about?";
        this.emit(':ask', `I can get information about bus ${busId} for you. ${repromptText}`, repromptText);
    },
    'GetSingleNextArrivalIntent': function(){
        let slots = this.event.request.intent.slots;
        let stopId = parseInt(slots.StopID.value);
        let busId = parseInt(slots.BusID.value);

        if(isNaN(stopId)){
            console.error(`ERROR: stopId is NaN.`);
            this.emit(':tell', "Sorry, I was not able to find information about that stop.");
            return;
        }

        if(isNaN(busId)){
            console.error(`ERROR: busId is NaN.`);
            if(isNaN(stopId)) {
                this.emit(':tell', "Sorry, I was not able to find information about that bus.");
            } else {
                this.emit(':tell', `Sorry, I was not able to find information about that bus at stop ${stopId}.`);
            };
            return;
        }

        triMetAPIInstance.getNextArrivalForBus(stopId, busId)
            .then(arrival => {
                let minutesRemaining = arrival.getMinutesUntilArrival();
                let minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
                let responseText = `${minutePronunciation} remaining until bus ${busId} arrives at stop ${stopId}.`;
                this.emit(':tell', responseText);
                return;
            })
            .catch(err => {
                console.error(err);
                this.emit(':tell', `Sorry, an error occurred retrieving arrival times for bus ${busId} at stop ${stopId}.`);
                return;
            });
    },
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