import ArrivalType from 'trimet-api-client/dist/ArrivalType'

class SpeechHelper {

    static getMinutePronunciation(minutesRemaining) {
        let pronunciation = minutesRemaining === 1 ? "minute" : "minutes";
        return minutesRemaining + " " + pronunciation;
    }

    static buildArrivalResponse(arrival) {
        let busId = arrival.route;
        let minutesRemaining = arrival.getMinutesUntilArrival();
        let arrivalType = arrival.getArrivalType();
        if(arrivalType === ArrivalType.MAX_TRAIN) {
            return `${arrival.getTrainSign()} train in ${this.getMinutePronunciation(minutesRemaining)}`;
        } else {
            return `bus ${busId} in ${this.getMinutePronunciation(minutesRemaining)}`;
        }
    }

    static buildArrivalsResponse(stopId, arrivals) {
        var speechOutput = `At stop ${stopId}, next arrivals are: `;
        for (var i = 0; i < arrivals.length - 1; i++) {
            speechOutput += `${this.buildArrivalResponse(arrivals[i])}, `
        }
        let last = arrivals.length - 1;
        speechOutput += `and ${this.buildArrivalResponse(arrivals[last])}.`;
        return speechOutput;
    }

    static singleNextArrivalResponse(triMetAPIInstance, stopId, busId){
        triMetAPIInstance.getNextArrivalForBus(stopId, busId)
            .then(arrival => {
                let minutesRemaining = arrival.getMinutesUntilArrival();
                let minutePronunciation = SpeechHelper.getMinutePronunciation(minutesRemaining);
                let responseText = `${minutePronunciation} remaining until bus ${busId} arrives at stop ${stopId}.`;
                this.emit(':tell', responseText);
                return;
            })
            .catch(err => {
                console.error(err);
                this.emit(':tell', `Sorry, an error occurred retrieving arrival times for bus ${busId} at stop ${stopId}.`);
                return;
            });
    }

    static allNextArrivalsResponse(triMetAPIInstance, stopId){
        triMetAPIInstance.getSortedFilteredArrivals(stopId)
            .then(arrivals => {
                let responseText = SpeechHelper.buildArrivalsResponse(stopId, arrivals);
                this.emit(':tell', responseText);
                return;
            })
            .catch(err => {
                console.error(err);
                this.emit(':tell', `Sorry, an error occurred retrieving arrival times for stop ${stopId}.`);
                return;
            });
    }
}

export default SpeechHelper

