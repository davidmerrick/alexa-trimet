import alexa from "alexa-app";

var app = new alexa.app("TriMet");
const SKILL_NAME = "TriMet Arrivals";

app.launch((request, response) => {
    let speechOutput = `Welcome to ${SKILL_NAME}. I can retrieve arrival times for bus and train stops in Portland, Oregon.`;
    response.say(speechOutput);
});

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