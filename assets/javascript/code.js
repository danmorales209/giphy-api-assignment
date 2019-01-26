function getGifs() {
    let queryURL = "http://api.giphy.com/v1/gifs/search?api_key=qCAxMUr8YJhkJ46mNoRpctyd48MOEhBe&fmt=json&limit=10";
    let term = $(this).text();

    queryURL += "&q=" + term;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then( function(response) {
        console.log(response); 

        let gifs = response.data;

        for (let i = 0; i < gifs.length; i++) {
            let gifDiv = $("<div>").attr("index",i);

            gifDiv.addClass("cats")
            
            gifDiv.append($("<img>").attr({
                "src": gifs[i].images.fixed_height_still.url,
                "alt": gifs[i].title
            }));
            
            gifDiv.append($("<p>").text(gifs[i].rating));
            
            gifDiv.on("click", function() {
                alert($(this).attr("index"));
            });

            $("#gifs-container").append(gifDiv);

        }
    })


}


$(document).ready(function () {
    // define topics array
    var topics = [
        "dragons" ,
        "zombie" ,
        "mummy" ,
        "vampire" 
    ];

    //iterate trhough topics array to dynamically generate buttons with jQuery
    for( let i = 0; i < topics.length; i++) {
        let newButton = $("<button>").text(topics[i]);
        $("#buttons-container").append(newButton);
    }

    // Add initial event listener to all buttons
    $("button").on("click", getGifs);


})