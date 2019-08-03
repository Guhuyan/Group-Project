$(document).ready(function () {

    // Initial variables
    let sQuery = "";
    let igdbResponse = {};
    let youtubeResponse = {};

    // Function that renders HTML from both IGDB and YouTube
    function renderArticle(igdbResponse, youtubeResponse) {
        let i = 0;
        let n = igdbResponse[i].total_rating.toFixed(2);
        $("#current-article").append(`
        <div class="article"">
            <h3 id="article-name">${igdbResponse[i].name}</h5>
            <h4 id="article-rating">Rating: ${n} /100 (${igdbResponse[i].total_rating_count})</h4>
            <p>${igdbResponse[i].summary}</p>
        </div>
        `);
        $("#youtube-carousel").html(`
                <div class="container">
                        <div id="carousel" class="carousel slide" data-ride="carousel" data-interval="false">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeResponse[0].id.videoId}" frameborder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeResponse[1].id.videoId}" frameborder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeResponse[2].id.videoId}" frameborder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeResponse[3].id.videoId}" frameborder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div class="embed-responsive embed-responsive-16by9">
                                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeResponse[4].id.videoId}" frameborder="0" 
                                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="carouselControls">
                            <div>
                                <a href="#carousel" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a href="#carousel" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                </div>
                `);
    }

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
    $("#submit").on("click", function () {
        $("#youtube-carousel").empty();
        event.preventDefault();
        $("#query-output").empty();
        $("#current-article").empty();
        let userInput = $("#user-input").val().trim();
        let queryURL = `https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games/?search=${userInput}&fields=cover.*,id,name`;
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
                        <img src="https:${sQuery[i].cover.url}" id="query-item-img" alt="Thumbnail-Image">
                        <div class="query-item-header">${sQuery[i].name}</h5>
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
    $(document).on("click", ".query-item", function () {
        event.preventDefault();
        // First AJAX call to retrieve data from IGDB
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
            igdbResponse = response;
            console.log(igdbResponse);

            // Second AJAX call to retrieve data from YouTube once an output from the first AJAX call has been clicked on
            let videoURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=${queryName}%20trailer&type=video&videoDefinition=high&key=AIzaSyC29aRZV3MpHpq53RmiGwX1Fc8By1VIqtU`;
            console.log(videoURL);
            $.ajax({
                url: videoURL,
                method: 'GET',
            }).then(response => {
                youtubeResponse = response.items;
                console.log(youtubeResponse);
            }).then(renderArticle(igdbResponse, youtubeResponse))
        })
            .catch(err => {
                console.error(err);
            });

        // Scroll function based on screen size (eg. scroll down if on mobile)
        $("html, body").animate({
            scrollTop: $(".article").offset().top
        }, 'slow');
    });
});