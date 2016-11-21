var ArrivalType = require('./ArrivalType');

var maxLines = [
    "blue",
    "red",
    "orange",
    "green",
    "yellow"
];

var Arrival = function(arrivalData){
    this.departed = arrivalData.departed;
    this.scheduled = arrivalData.scheduled;
    this.shortSign = arrivalData.shortSign;
    this.blockPosition = arrivalData.blockPosition;
    this.estimated = arrivalData.estimated;
    this.dir = arrivalData.dir;
    this.route = arrivalData.route;
    this.detour = arrivalData.detour;
    this.piece = arrivalData.piece;
    this.fullSign = arrivalData.fullSign;
    this.block = arrivalData.block;
    this.locid = arrivalData.locid;
    this.status = arrivalData.status;

    var trainSign = this.getTrainSign();
    if(maxLines.indexOf(trainSign.toLowerCase()) !== -1){
        this.arrivalType = ArrivalType.MAX_TRAIN;
    } else {
        this.arrivalType = ArrivalType.BUS;
    }
};

Arrival.prototype.getNextArrivalTime = function(){
    if (this.estimated) {
        return Date.parse(this.estimated);
    }
    return Date.parse(this.scheduled);
};

Arrival.prototype.getMinutesUntilArrival = function(){
    var arrivalTime = this.getNextArrivalTime();
    var now = Date.now();
    var diffMs = arrivalTime - now;
    var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    return diffMins;
};

Arrival.prototype.getTrainSign = function(){
    return this.shortSign.split(" ")[0];
};

Arrival.prototype.getBusID = function(){
    return this.route;
};

Arrival.prototype.getArrivalType = function() {
    return this.arrivalType;
}

module.exports = Arrival;