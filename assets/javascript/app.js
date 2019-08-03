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
            if ($(window).width() >= 767) {
                $("html, body").animate({ scrollTop: 0 }, "slow");
            }
        else {
            $('html,body').animate({
                scrollTop: $("#current-article").offset().top
            }, 'slow');
                    
        }
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
                        console.log(response);
                        let i = 0;
                        let n = response[i].total_rating.toFixed(2);
                        $("#current-article").append(`
            <div class="article"">
                <h3 id="article-name">${response[i].name}</h5>
                <h4 id="article-rating">Rating: ${n} (${response[i].total_rating_count})</h4>
                <p>${response[i].summary}</p>
            </div>
            `);
                    })



                        .catch(err => {
                            console.error(err);
                        });
                }
            );


        // Second AJAX call to retrieve data from YouTube
        let videoURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&order=viewCount&q=${queryName}%20trailer&type=video&videoDefinition=high&key=AIzaSyC29aRZV3MpHpq53RmiGwX1Fc8By1VIqtU`;
        console.log(videoURL);
        $.ajax({
            url: videoURL,
            method: 'GET',
        }).then(response => {
            ytQuery = response.items;
            $("#youtube-carousel").html(`
            <div class="container">
                    <div id="carousel" class="carousel slide" data-ride="carousel" data-interval="false">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${ytQuery[0].id.videoId}" frameborder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${ytQuery[1].id.videoId}" frameborder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${ytQuery[2].id.videoId}" frameborder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${ytQuery[3].id.videoId}" frameborder="0" 
                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="embed-responsive embed-responsive-16by9">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${ytQuery[4].id.videoId}" frameborder="0" 
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
            /*
            for (i = 0; i < ytQuery.length; i++) {
                $("#youtube-carousel").append(`
                <div class="article-video-thumbnails">
                <img src="${ytQuery[i].snippet.thumbnails.medium.url}">
                </div>
                `);
                console.log(ytQuery[0].id.videoId);
            };
            */
        });

    });



