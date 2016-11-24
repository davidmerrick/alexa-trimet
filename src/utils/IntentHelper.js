var SpeechHelper = require('./SpeechHelper');
var TriMetAPI = require('trimet-api-client');
var ArrivalType = require('trimet-api-client/ArrivalType');

var TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

var IntentHelper = module.exports = {
    getSingleNextArrival: function(stopID, busID, callback){
        try {
            TriMetAPIInstance.getNextArrivalForBus(stopID, busID, function (arrival) {
                try {
                    if (!arrival) {
                        callback(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
                    }
                    var minutesRemaining = arrival.getMinutesUntilArrival();
                    var minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
                    callback(`${minutePronunciation} until the next bus ${busID} at stop ${stopID}`);
                } catch(error){
                    callback(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
                }
            });
        } catch(error){
            callback(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
        }
    },
    getAllNextArrivals: function(stopID, callback) {
        try {
            TriMetAPIInstance.getSortedFilteredArrivals(stopID, function (arrivals) {
                try {
                    if (!arrivals || arrivals.length === 0) {
                        callback(`Sorry, I was not able to find arrival information for stop ${stopID}`);
                    }
                    var speechOutput = SpeechHelper.buildArrivalsResponse(stopID, arrivals);
                    callback(speechOutput);
                } catch(error){
                    callback(`Sorry, I was not able to find information for bus ${busID} at stop ${stopID}`);
                }
            });
        } catch(error){
            callback(`Sorry, I was not able to find arrival information for stop ${stopID}`);
        }
    }
};

module.exports = IntentHelper;