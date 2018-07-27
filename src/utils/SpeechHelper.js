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
        var speechOutput = `At stop <say-as interpret-as="digits">${stopId}</say-as>, next arrivals are: `;
        for (var i = 0; i < arrivals.length - 1; i++) {
            speechOutput += `${this.buildArrivalResponse(arrivals[i])}, `
        }
        let last = arrivals.length - 1;
        speechOutput += `and ${this.buildArrivalResponse(arrivals[last])}.`;
        return speechOutput;
    }
}

export default SpeechHelper

