var SpeechHelper = require('./SpeechHelper');
var TriMetAPI = require('trimet-api-client');
var ArrivalType = require('trimet-api-client/ArrivalType');

var TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

var IntentHelper = module.exports = {
    getSingleNextArrival: function(stopID, busID, callback){
        TriMetAPIInstance.getNextArrivalForBus(stopID, busID, function(err, arrival) {
            if(err) {
                callback(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
            }
            var minutesRemaining = arrival.getMinutesUntilArrival();
            var minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
            callback(`${minutePronunciation} until the next bus ${busID} at stop ${stopID}`);
        });
    },
    getAllNextArrivals: function(stopID, callback) {
        TriMetAPIInstance.getSortedFilteredArrivals(stopID, function (err, arrivals) {
            if(err) {
                callback(`Sorry, I was not able to find arrival information for stop ${stopID}`);
            }
            var speechOutput = SpeechHelper.buildArrivalsResponse(stopID, arrivals);
            callback(speechOutput);
        });
    }
};

module.exports = IntentHelper;