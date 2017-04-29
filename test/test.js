import {expect} from 'chai';
import SpeechHelper from '../src/utils/SpeechHelper'
import TriMetAPI from 'trimet-api-client'

function minutesShouldBePlural(minutesRemaining){
    var speechOutput = SpeechHelper.getMinutePronunciation(minutesRemaining);
    expect(speechOutput).to.equal(minutesRemaining + " minutes");
}

function minutesShouldNotBePlural(minutesRemaining){
    var speechOutput = SpeechHelper.getMinutePronunciation(minutesRemaining);
    expect(speechOutput).to.equal(minutesRemaining + " minute");
}

const TriMetAPIInstance = new TriMetAPI(process.env.TRIMET_API_KEY);

describe("Speech Helper Test", () => {
    it("Should output correctly for a single arrival.", function(){
        var busID = 20;
        var stopID = 749;

        // Fake arrivalData pulled from TriMet API
        var arrivalData = {
            departed: true,
            scheduled: "2016-11-22T13:10:54.000-0800",
            shortSign: "20 Gresham TC",
            blockPosition: null,
            estimated: "2016-11-22T13:32:47.000-0800",
            dir: 0,
            route: busID,
            detour: false,
            piece: "1",
            fullSign: "20 Burnside\/Stark to Gresham TC",
            block: 2037,
            locid: stopID,
            status: "estimated"
        };

        var minutesRemaining = 5;
        var arrival = new Arrival(arrivalData);
        arrival.getMinutesUntilArrival = function(){
            return minutesRemaining;
        };

        var speechOutput = SpeechHelper.buildSingleArrivalResponse(arrival);
        var expectedOutput = "bus " + busID + " in " + minutesRemaining + " minutes";
        expect(speechOutput).to.equal(expectedOutput);
    });

    it("Should correctly pronounce minute values > 1", function(){
        minutesShouldBePlural(5);
    });

    it("Should correctly pronounce minute values > 1", function(){
        minutesShouldNotBePlural(1);
    });

    it("Should correctly pronounce minute values < 1", function(){
        minutesShouldBePlural(0);
    });

    it("Test get multiple arrivals", done => {
        let stopId = 755;

        return TriMetAPIInstance.getSortedFilteredArrivals(stopId)
            .then(arrivals => {
                let responseText = SpeechHelper.buildArrivalsResponse(stopId, arrivals);
                done();
            })
            .catch(err => {
                throw new Error(err);
            });
    });

    it("Test get single arrival", done => {
        let stopId = 755;
        let busId = 20;

        return TriMetAPIInstance.getNextArrivalForBus(stopId, busId)
            .then(arrival => {
                let minutesRemaining = arrival.getMinutesUntilArrival();
                let minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
                let responseText = `${minutePronunciation} remaining until bus ${busId} arrives at stop ${stopId}.`;
                done();
            })
            .catch(err => {
                throw new Error(err);
            });
    });
});