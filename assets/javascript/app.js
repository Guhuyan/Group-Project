$( document ).ready(function() {

    // When the document is finished loading, start the clock.
    function startClock() {
        let clock = setInterval(displayClock, 1000);
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

    $("#submit").on("click", function() {
        event.preventDefault();
        let userInput = $("#user-input").val().trim();
        let queryURL = `https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games/?search=${userInput}&fields=id,name`;
        $.ajax({
            url: queryURL,
            method: 'POST',
            headers: {
                'user-key': '73e145ac8c0ebbcea1ebea4527dba99e',
            },
        }).then(response => {
                console.log(response);
            })
            .catch(err => {
                console.error(err);
            });
    });

});