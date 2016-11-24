/**
 * App ID for the skill
 */
var APP_ID = process.env.APP_ID;

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var TriMetAPI = require('trimet-api-client');
var ArrivalType = require('trimet-api-client/ArrivalType');
var TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);
var SpeechHelper = require('./utils/SpeechHelper');

var TriMet = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
TriMet.prototype = Object.create(AlexaSkill.prototype);
TriMet.prototype.constructor = TriMet;

// ----------------------- Override AlexaSkill request and intent handlers -----------------------

TriMet.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId: ${sessionStartedRequest.requestId}, sessionId: ${session.sessionId}`);
    // any initialization logic goes here
};

TriMet.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log(`onLaunch requestId: ${launchRequest.requestId}, sessionId: ${session.sessionId}`);
    handleWelcomeRequest(response);
};

TriMet.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId: ${sessionEndedRequest.requestId}, sessionId: ${session.sessionId}`);
    // any cleanup logic goes here
};

TriMet.prototype.intentHandlers = {
    "LaunchIntent": function (intent, session, response) {
        handleWelcomeRequest(response);
    },
    "GetSingleNextArrivalIntent": function (intent, session, response) {
        var busID = intent.slots.BusID.value;
        var stopID = intent.slots.StopID.value;
        TriMetAPIInstance.getNextArrivalForBus(stopID, busID, function(arrival){
            if(!arrival){
                response.tell(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
                return;
            }
            var minutesRemaining = arrival.getMinutesUntilArrival();
            var minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
            response.tell(`${minutePronunciation} until the next bus ${busID} at stop ${stopID}`);
        });
    },
    "GetAllNextArrivalsIntent": function (intent, session, response) {
        var stopID = intent.slots.StopID.value;
        TriMetAPIInstance.getSortedFilteredArrivals(stopID, function(arrivals){
            var speechOutput = SpeechHelper.buildArrivalsResponse(stopID, arrivals);
            response.tell(speechOutput);
        });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        handleHelpRequest(response);
    },
    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },
    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

function handleWelcomeRequest(response) {
    var repromptText = "Which bus stop would you like information for?";
    var speechOutput = `Welcome to TriMet Arrivals. I can retrieve arrival times for bus and train stops in Portland, Oregon. ${repromptText}`;
    response.ask(speechOutput, repromptText);
}

function handleHelpRequest(response) {
    var repromptText = "Which bus stop would you like information for?";
    var speechOutput = `I can give you information on next arrivals and bus schedules for Portland. ${repromptText}`;
    response.ask(speechOutput, repromptText);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var triMet = new TriMet();
    triMet.execute(event, context);
};