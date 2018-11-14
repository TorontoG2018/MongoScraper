$(".scrape").on("click",function(){
  $.ajax({
    method: "GET",
      url: "/scrape"
  }).done(function(data){
    console.log(data);
    window.location="/";
  }) 
})


// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<div class='frame-me'> <p class='the-text' data-id='" +
        data[i]._id +
        "'>" +
        data[i].title +
        "</p></br><p class='the-link'>" +
        "<a href='" +
        "https://www.washingtontimes.com" +
        data[i].link +
        "'>" +
        data[i].link +
        "</a></p></br><button class='button-primary' data-id='" +
        data[i]._id +
        "' id='addnote'>Add Note</button>" +
        "<button class='button-primary' data-id='" +
        data[i]._id +
        "' id='delete'>Delete</button>"
    );
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    }).fail(function(err) {
      alert("ZOMG WHAT???");
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#delete", function() {
  var thisId = $(this).attr("data-id");
  $(this)
    .parent()
    .remove();
  var objectId = { _id: thisId };
});
$(document).on("click", "#deletenote", function() {
  var thisId = $(this).attr("data-id");
  $(this)
    .parent()
    .empty();
});

$(document).on("click", "#addnote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h5><em>" + data.title + "</em></h5>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append(
        "<textarea class='u-full-width' placeholder='Start writing your note here ...' id='bodyinput' name='body'></textarea>"
      );
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button class='button-primary' data-id='" +
          data._id +
          "' id='savenote'>Save Note</button>"
      );

      $("#notes").append(
        "<button class='button-primary' data-id='" +
          data._id +
          "' id='deletenote'>Delete Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});