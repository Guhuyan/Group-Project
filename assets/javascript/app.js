$(document).ready(function () {
    // Initial variables
    let sQuery = "";

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

    // On-click event handler for the submit button
    $("#submit").on("click", function() {
        event.preventDefault();
        $("#query-output").empty();
        $("#current-article").empty();
        let userInput = $("#user-input").val().trim();
        let queryURL = `https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games/?search=${userInput}&fields=id,name`;
        if (userInput != "") {
            $.ajax({
                url: queryURL,
                method: 'POST',
                headers: {
                    'user-key': '73e145ac8c0ebbcea1ebea4527dba99e',
                },
            }).then(response => {
                sQuery = response;
                console.log(sQuery);
                for (i = 0; i < sQuery.length; i++) {
                    $("#query-output").append(`
                    <div class="query-item" query-name="${sQuery[i].name}">
                        <h5>${sQuery[i].name}</h5>
                    </div>
                    `);
                 };
            })
            .catch(err => {
                console.error(err);
            });
        };
        
    });

    // On-click event handler for query result(s)
    $(document).on("click", ".query-item", function() {
        event.preventDefault();
        $("#current-article").empty();
        let queryName = $(this).attr("query-name");
        console.log(queryName);
        let queryURL = `https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games/?search=${queryName}&fields=artworks.*,cover.*,id,name,url,screenshots.*,summary,storyline,total_rating,total_rating_count,websites.*`;
        $.ajax({
            url: queryURL,
            method: 'POST',
            headers: {
                'user-key': '73e145ac8c0ebbcea1ebea4527dba99e',
            },
        }).then(response => {
            console.log(response);
            let i = 0;
            let n = response[i].total_rating.toFixed(2);
            $("#current-article").append(`
            <div class="article"">
                <h3>${response[i].name}</h5>
                <h4>Rating: ${n} (${response[i].total_rating_count})</h4>
                <p>${response[i].summary}</p>
            </div>
            `);
        })
        .catch(err => {
            console.error(err);
        });
        queryName = "";
    });

});