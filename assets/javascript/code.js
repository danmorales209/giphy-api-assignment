function getGifs() {
    $("#gifs-container").empty();

    let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=qCAxMUr8YJhkJ46mNoRpctyd48MOEhBe&fmt=json&limit=10";
    let term = $(this).text();

    queryURL += "&q=" + term;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        let gifs = response.data;

        for (let i = 0; i < gifs.length; i++) {
            let gifDiv = $("<div>").attr({ "static": "true", "index": i });
            gifDiv.addClass("card");

            gifDiv.append($("<img>").attr({
                "src": gifs[i].images.fixed_height_still.url,
                "alt": gifs[i].title,
                "class": "card-img-top"
            }));

            gifDiv.append($("<p>").text(gifs[i].rating));

            gifDiv.on("click", function () {
                changeGif($(this), gifs);
            });

            $("#gifs-container").append(gifDiv);

        }
    })


}

function changeGif(object, data) {
    let index = object.attr("index");

    if (object.attr("static") === "true") {

        object.children("img").attr("src", data[index].images.fixed_height.url);
        object.attr("static", "false");
    }
    else if (object.attr("static") === "false") {
        object.children("img").attr("src", data[index].images.fixed_height_still.url);
        object.attr("static", "true");
    }
}

function buildButtons(inArray) {
    $("#buttons-container").empty();

    for (let i = 0; i < inArray.length; i++) {
        let newButton = $("<button>").text(inArray[i]);
        newButton.addClass("btn btn-success btn-outline-light mx-sm-1 my-sm-1 gif-button");
        $("#buttons-container").append(newButton);
    }

    // Add event listener to all buttons
    $(".gif-button").on("click", getGifs);
}

function addTopic(inArray) {
    let newTopic = $("#add-topic").val().trim();
    $("#add-topic").val("");

    inArray.push(newTopic);
    buildButtons(inArray);

}


$(document).ready(function () {
    // define topics array
    var topics = [
        "dragons",
        "zombie",
        "mummy",
        "vampire"
    ];

    //iterate trhough topics array to dynamically generate buttons with jQuery
    buildButtons(topics);

    $("#add-topic-button").on("click", function (event) {
        event.preventDefault();
        addTopic(topics);
    });


})