import {ArrivalType} from 'trimet-api-client'

class SpeechHelper {

    static getMinutePronunciation(minutesRemaining) {
        var minutePronunciation = minutesRemaining == 1 ? "minute" : "minutes";
        return minutesRemaining + " " + minutePronunciation;
    }

    static buildArrivalResponse(arrival) {
        var busID = arrival.route;
        var minutesRemaining = arrival.getMinutesUntilArrival();
        var arrivalType = arrival.getArrivalType();
        if (arrivalType === ArrivalType.MAX_TRAIN) {
            return `${arrival.getTrainSign()} train in ${SpeechHelper.getMinutePronunciation(minutesRemaining)}`;
        } else {
            return `bus ${busID} in ${SpeechHelper.getMinutePronunciation(minutesRemaining)}`;
        }
    }

    static buildArrivalsResponse(stopID, arrivals) {
        var speechOutput = `At stop ${stopID}, next arrivals are: `;
        for (var i = 0; i < arrivals.length - 1; i++) {
            speechOutput += `${SpeechHelper.buildArrivalResponse(arrivals[i])}, `
        }
        var last = arrivals.length - 1;
        speechOutput += `and ${SpeechHelper.buildArrivalResponse(arrivals[last])}.`;
        return speechOutput;
    }
}

export default SpeechHelper

