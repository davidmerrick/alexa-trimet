import alexa from "alexa-app";
import TriMetAPI from 'trimet-api-client'
import SpeechHelper from './utils/SpeechHelper'

const app = new alexa.app("TriMet");
const SKILL_NAME = "TriMet Arrivals";
const TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

app.launch((request, response) => {
    let speechOutput = `Welcome to ${SKILL_NAME}. I can retrieve arrival times for bus and train stops in Portland, Oregon.`;
    response.say(speechOutput);
});

app.intent(
    "GetSingleNextArrivalIntent",
    {
        "slots": {
            "StopID": "AMAZON.NUMBER",
            "BusID": "AMAZON.NUMBER"
        }
    },
    (request, response) => {
        let stopId = request.slot("StopID");
        let busId = request.slot("BusID");
        return TriMetAPIInstance.getNextArrivalForBus(stopId, busId)
            .then(arrival => {
                let minutesRemaining = arrival.getMinutesUntilArrival();
                let minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
                let responseText = `${minutePronunciation} remaining until bus ${busId} arrives at stop ${stopId}.`;
                response.say(responseText);
            })
            .catch(err => {
                response.say(`Sorry, an error occurred retrieving arrival times for bus ${busId} at stop ${stopId}.`);
            });
    }
);

app.intent(
    "GetAllNextArrivalsIntent",
    {
        "slots": {
            "StopID": "AMAZON.NUMBER"
        }
    },
    (request, response) => {
        let stopId = request.slot("StopID");
        return TriMetAPIInstance.getSortedFilteredArrivals(stopId)
            .then(arrivals => {
                let responseText = SpeechHelper.buildArrivalsResponse(stopId, arrivals);
                response.say(responseText);
            })
            .catch(err => {
                response.say(`Sorry, an error occurred retrieving arrival times for stop ${stopId}.`);
            });
    }
);


app.intent("AMAZON.HelpIntent",{}, (request, response) => {
    let speechOutput = "You can ask Donald Trump anything. For example, ask Donald Trump about his tax returns";
    response.say(speechOutput);
});

app.intent("AMAZON.StopIntent",{}, (request, response) => {
    let speechOutput = "Goodbye";
    response.say(speechOutput);
});

app.intent("AMAZON.CancelIntent",{}, (request, response) => {
    let speechOutput = "Okay";
    response.say(speechOutput);
});

// connect the alexa-app to AWS Lambda
exports.handler = app.lambda();