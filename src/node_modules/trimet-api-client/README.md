API wrapper for TriMet, written in Node. Note: This is a work-in-progress. Will be uploading it as an official NPM package soon.

NPM package: https://www.npmjs.com/package/trimet-api-client

## Usage

var TriMetAPI = require('trimet-api');

var TriMetAPIInstance = new TriMetAPI(YOUR_TRIMET_API_KEY);

### Get next arrival for bus at given stop

TriMetAPIInstance.getNextArrivalForBus(stopID, busID, function(arrival){
    var minutesRemaining = arrival.getMinutesUntilArrival();
    console.log("Bus " + busID + " arriving in " + minutesRemaining + " min");
});
