var savedGifs = [];

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
            let gifDiv = $("<div>").addClass("card");
            let innerDiv = $("<div>").addClass("card-body p-sm-1 m-sm-1 text-center");
            let gifText = $("<p>").addClass("card-body m-sm-1 p-sm-1 text-center");
            let dlButton = buildButton("Download");
            let saveButton = buildButton("Save");
            let buttonGroup = $("<div>").addClass("button-group d-block mx-auto btn-group-sm");

            gifDiv.attr("id", `gif-card-${i}`);

            dlButton.attr({
                "type": "submit",
                "onclick": `window.open('${gifs[i].images.fixed_height.url}')`
            });

            saveButton.attr("index", i);
            saveButton.addClass("save-button");

            gifDiv.append($("<img>").attr({
                "src": gifs[i].images.fixed_height_still.url,
                "alt": gifs[i].title,
                "class": "card-img-top mb-sm-1",
                "static": "true",
                "index": i
            }));

            gifText.text(`Rating: ${gifs[i].rating}`);

            saveButton.on("click", function () {
                let index = $(this).attr("index");
                let currentCard = $(`#gif-card-${index}`);

                currentCard.appendTo($("#save-container"));

                savedGifs.push(gifs[i]);
                window.localStorage.setItem("savedGifs", JSON.stringify(savedGifs));

                $(this).remove();
            })

            buttonGroup.append(dlButton);
            buttonGroup.append(saveButton);

            innerDiv.append(gifText);
            innerDiv.append(buttonGroup);

            gifDiv.append(innerDiv);

            gifDiv.children("img").on("click", function () {
                changeGif($(this), gifs);
            });

            $("#gifs-container").append(gifDiv);

        }
    })
}

function pushToLocalStorage(object) {

}

function buildButton(inText) {
    let dummyButton = $("<button>");

    dummyButton.text(inText);
    dummyButton.addClass("btn btn-dark btn-sm m-sm-1");

    return dummyButton;

}

function changeGif(object, data) {
    let index = object.attr("index");

    if (object.attr("static") === "true") {

        object.attr("src", data[index].images.fixed_height.url);
        object.attr("static", "false");
    }
    else if (object.attr("static") === "false") {
        object.attr("src", data[index].images.fixed_height_still.url);
        object.attr("static", "true");
    }
}

function buildButtons(inArray) {
    $("#buttons-container").empty();

    for (let i = 0; i < inArray.length; i++) {
        let newButton = $("<button>").text(inArray[i]);
        newButton.addClass("btn btn-success btn-outline-light mx-sm-1 my-sm-1 float-left  gif-button");
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

function loadSavedGifs(gifs) {
    for (let i = 0; i < gifs.length; i++) {
        let gifDiv = $("<div>").addClass("card");
        let innerDiv = $("<div>").addClass("card-body p-sm-1 m-sm-1 text-center");
        let gifText = $("<p>").addClass("card-body m-sm-1 p-sm-1 text-center");
        let buttonGroup = $("<div>").addClass("button-group d-block mx-auto btn-group-sm");
        let dlButton = buildButton("Download");

        dlButton.attr({
            "type": "submit",
            "onclick": `window.open('${gifs[i].images.fixed_height.url}')`
        });


        gifDiv.append($("<img>").attr({
            "src": gifs[i].images.fixed_height_still.url,
            "alt": gifs[i].title,
            "class": "card-img-top mb-sm-1",
            "static": "true",
            "index": i
        }));

        gifText.text(`Rating: ${gifs[i].rating}`);

        buttonGroup.append(dlButton);

        innerDiv.append(gifText);
        innerDiv.append(buttonGroup);

        gifDiv.append(innerDiv);

        gifDiv.children("img").on("click", function () {
            changeGif($(this), gifs);
        });

        $("#save-container").append(gifDiv);

    }
}


$(document).ready(function () {
    // define topics array
    var topics = [
        "dragons",
        "zombie",
        "mummy",
        "vampire",
        "minotaur",
        "cyclops",
        "golem",
        "medusa",
        "unicorn",
        "goblin",
        "dwarf",
        "gnome"
    ];

    //iterate trhough topics array to dynamically generate buttons with jQuery
    buildButtons(topics);

    if (window.localStorage.getItem("savedGifs")) {
        savedGifs = JSON.parse(window.localStorage.getItem("savedGifs"));
    }

    loadSavedGifs(savedGifs);

    $("#add-topic-button").on("click", function (event) {
        event.preventDefault();
        addTopic(topics);
    });


    $("#clear-button").on("click", function (event) {
        event.preventDefault();
        $("#save-container").empty();
        window.localStorage.removeItem("savedGifs")
    })


})