// global variable to save gifData objects.
var savedGifs = [];


function getGifs() {
// function to generate 10 gifs using GIPHY API. Builds cards to store all the info, and adds the Download button and
// save button and event listener

    // clear the gif container of gifs using jQuery
    $("#gifs-container").empty();

    // build the API search request
    let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=qCAxMUr8YJhkJ46mNoRpctyd48MOEhBe&fmt=json&limit=10";
    let term = $(this).text();

    queryURL += "&q=" + term;

    // ajax call to query API
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        let gifs = response.data;

        // Returns an array of 10 objects. Iterates through each and builds the cards dynamically
        for (let i = 0; i < gifs.length; i++) {
            
            // Declare all tags for the card class. Based upon Bootstrap 4 with image at top
            let gifDiv = $("<div>").addClass("card");
            let innerDiv = $("<div>").addClass("card-body p-sm-1 m-sm-1 text-center");
            let gifText = $("<p>").addClass("card-body m-sm-1 p-sm-1 text-center");
            let dlButton = buildButton("Download");
            let saveButton = buildButton("Save");
            let buttonGroup = $("<div>").addClass("button-group d-block mx-auto btn-group-sm");

            // Add IDs dynamically
            gifDiv.attr("id", `gif-card-${i}`);

            // Add "download" to download button
            dlButton.attr({
                "type": "submit",
                "onclick": `window.open('${gifs[i].images.fixed_height.url}')`
            });

            saveButton.attr("index", i);
            saveButton.addClass("save-button");

            // add custom attributes to enable swapping static and dynamic gif
            gifDiv.append($("<img>").attr({
                "src": gifs[i].images.fixed_height_still.url,
                "alt": gifs[i].title,
                "class": "card-img-top mb-sm-1",
                "static": "true",
                "index": i
            }));

            gifText.text(`Rating: ${gifs[i].rating}`);

            // save button event listener
            saveButton.on("click", function () {
                let index = $(this).attr("index");
                let currentCard = $(`#gif-card-${index}`);

                // Move the card to the saved card section
                currentCard.appendTo($("#save-container"));

                // add the corresponing GIPHY API object to the saved gifs array
                savedGifs.push(gifs[i]);

                // use JSON.stringify to convert the savedGifs array to a string to save in local Storage
                window.localStorage.setItem("savedGifs", JSON.stringify(savedGifs));

                // Remove the card from the gif display
                $(this).remove();
            });

            buttonGroup.append(dlButton);
            buttonGroup.append(saveButton);

            innerDiv.append(gifText);
            innerDiv.append(buttonGroup);

            gifDiv.append(innerDiv);

            // event listener for gif image
            gifDiv.children("img").on("click", function () {
                changeGif($(this), gifs);
            });

            $("#gifs-container").append(gifDiv);

        }
    })
}

function buildButton(inText) {
    //simple function to build buttons inside cards, and add inText inside.
    // Returns jQuery object
    let dummyButton = $("<button>");

    dummyButton.text(inText);
    dummyButton.addClass("btn btn-dark btn-sm m-sm-1");

    return dummyButton;

}

function changeGif(object, data) {
    // function to swtich between static and dynamic gif display. PAss in GIPHY API object as data source, and jQuery
    // img as object
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
    // Build the initial buttons to get gifs
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
    // Function to add new topics from user form
    let newTopic = $("#add-topic").val().trim();
    $("#add-topic").val("");

    inArray.push(newTopic);
    buildButtons(inArray);

}

function loadSavedGifs(gifs) {
    // uses data stored in localStorage to build saved gifs. Data is saved in the same format as GIPHY API data
    // pass in data from Gifs object array. Code is essentialy the same as the build gif image, except no save button is generated

    for (let i = 0; i < gifs.length; i++) {
        // declare tags. Modeled using Bootstrap 4 cards
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
    // runs on page load, setup the page with inital selections
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

    // Check for localStorage, and populates savedGifs with the data saved in the array, if any exists
    if (window.localStorage.getItem("savedGifs")) {
        savedGifs = JSON.parse(window.localStorage.getItem("savedGifs"));
    }

    // Build the saved gifs cards if any data exists in localStorage
    loadSavedGifs(savedGifs);

    // Add event listener on topic buttons to add gifs to the page on click
    $("#add-topic-button").on("click", function (event) {
        event.preventDefault();
        addTopic(topics);
    });

    // Add clear event listener to clear button on the saved gifs section
    $("#clear-button").on("click", function (event) {
        event.preventDefault();
        $("#save-container").empty();
        window.localStorage.removeItem("savedGifs")
    })
})