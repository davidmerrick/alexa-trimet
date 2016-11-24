/**
 * Note: callback structure uses Node convention of error-first callbacks.
 * See: http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/
 */

var request = require('request');
var Arrival = require('./Arrival');

var TriMetAPI = function(TRIMET_API_KEY){
    this.TRIMET_API_KEY = TRIMET_API_KEY;
    this.TRIMET_BASE_URL = "https://developer.trimet.org/ws/V1/arrivals?";
};

TriMetAPI.prototype.getNextArrivalForBus = function(stopID, busID, callback){
    this.getSortedFilteredArrivals(stopID, function(err, arrivals){
        if(err){
            callback(err);
            return;
        }
        try {
            var arrivalsForStop = arrivals.filter(function (arrival) {
                return arrival.route == busID;
            });
            var arrivalData = arrivalsForStop[0];
            var arrival = new Arrival(arrivalData);
            callback(null, arrival);
        } catch(err){
            callback(err);
        };
    });
};

TriMetAPI.prototype.getTrimetStopUrl = function(stopID){
    return this.TRIMET_BASE_URL + "locIDs=" + stopID + "&appID=" + this.TRIMET_API_KEY + "&json=true";
};

TriMetAPI.prototype.getSortedFilteredArrivals = function(stopID, callback){
    var url = this.getTrimetStopUrl(stopID);
    var _this = this;
    var options = {
        url: url,
        withCredentials: false
    };
    request(options, function(error, response, body){
        if(!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            var arrivalDatas = result.resultSet.arrival;
            if(arrivalDatas == null || arrivalDatas.length === 0){
                callback(new Error("No arrivals found."));
                return;
            }
            var arrivals = arrivalDatas.map(function(arrivalData) {
                return new Arrival(arrivalData);
            });
            arrivals = _this.sortArrivals(arrivals);

            // Filter for arrivals that have already happened
            arrivals = arrivals.filter(function (arrival) {
                var minutesRemaining = arrival.getMinutesUntilArrival();
                return minutesRemaining > 0;
            });

            callback(null, arrivals);
        } else {
            callback(new Error(`Error in request to TriMet API. Response: ${response.statusCode}`));
        }
    });
};

TriMetAPI.prototype.getNextArrivalsForTrainStop = function(stopID, callback){
    this.getSortedFilteredArrivals(stopID, function(err, arrivals){
        if(err){
            callback(err);
            return;
        }
        var arrival = arrivals[0];
        callback(null, arrival);
    });
};

TriMetAPI.prototype.sortArrivals = function(arrivals){
    arrivals.sort(function(a, b) {
        var aNextArrivalTime = a.getNextArrivalTime();
        var bNextArrivalTime = b.getNextArrivalTime();
        if(aNextArrivalTime > bNextArrivalTime){
            return 1;
        } else if(aNextArrivalTime == bNextArrivalTime){
            return 0;
        } else {
            return -1;
        }
    });
    return arrivals;
};

module.exports = TriMetAPI;