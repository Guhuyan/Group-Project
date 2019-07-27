$(document).ready(function () {

    // When the document is finished loading, start the clock.
    function startClock() 
    {
        let clock = setInterval(displayClock, 0);
    }
    function returnTime() {
        let time = moment();
        let readableTime = time.format('LLLL');
        return readableTime;
    }
    function displayClock() {
        $("#clock").text(returnTime());
    }
    startClock();
    //


});