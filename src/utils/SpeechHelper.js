var ArrivalType = require('trimet-api-client/ArrivalType');

var SpeechHelper = module.exports = {
    getMinutePronunciation: function (minutesRemaining) {
        var minutePronunciation = minutesRemaining == 1 ? "minute" : "minutes";
        return minutesRemaining + " " + minutePronunciation;
    },
    buildArrivalResponse: function (arrival) {
        var route = arrival.route;
        var minutesRemaining = arrival.getMinutesUntilArrival();
        var arrivalType = arrival.getArrivalType();
        if (arrivalType === ArrivalType.MAX_TRAIN) {
            return arrival.getTrainSign() + " train in " + SpeechHelper.getMinutePronunciation(minutesRemaining);
        } else {
            return "bus " + route + " in " + SpeechHelper.getMinutePronunciation(minutesRemaining);
        }
    },
    buildArrivalsResponse: function (stopID, arrivals) {
        var speechOutput = "At stop " + stopID + ", next arrivals are: ";
        for (var i = 0; i < arrivals.length - 1; i++) {
            speechOutput += SpeechHelper.buildArrivalResponse(arrivals[i]) + ", "
        }
        var last = arrivals.length - 1;
        speechOutput += "and " + SpeechHelper.buildArrivalResponse(arrivals[last]) + ".";
        return speechOutput;
    }
};

module.exports = SpeechHelper;

