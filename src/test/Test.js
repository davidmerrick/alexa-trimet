var expect = require('chai').expect;
var rewire = require('rewire');
var SpeechHelper = require('../utils/SpeechHelper');
var Arrival = rewire('trimet-api-client/Arrival');

describe("Speech Helper Test", function(){
    // Todo: Work in progress. These tests aren't working yet.
    it("Should output correctly for a single arrival.", function(){
        var arrivalData = {
            departed: null,
            scheduled: null,
            shortSign: null,
            blockPosition: null,
            estimated: null,
            dir: null,
            route: null,
            detour: null,
            piece: null,
            fullSign: "20",
            block: null,
            locid: null,
            status: null
        };

        var arrival = new Arrival(arrivalData);
        arrival.__set__("getMinutesUntilArrival", function(){
            return 5;
        });
        expect(arrival.getMinutesUntilArrival()).to.equal(5);
    });
});