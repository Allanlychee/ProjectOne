$(".submitBTN").on('click', function () {
  $("#content").empty()
  $(".userInput").hide()
  var querySearch = $("#eventSearch").val().trim()
  var queryLocation = $("#locationSearch").val().trim()
  var queryDate = "future"
  $.ajax({
    url: "https://crossorigin.me/http://api.eventful.com/json/events/search?keywords=" + querySearch + "&location=" + queryLocation + "&" + queryDate + "=Future&app_key=mW7nqRDmDzZsdTFH",
    method: "GET"
  }).then(function (response) {
    var queryParse = JSON.parse(response)
    for (i = 0; i < 10; i++) {
      console.log(queryParse.events.event[i].title)
      console.log(queryParse.events.event[i])
      var div = $('<div>')
      var title = "<h5>" + (i + 1) + ". " + queryParse.events.event[i].title + "</h5><hr>"
      var description = "<p>" + queryParse.events.event[i].description + "</p>"
      var startTime = "<p>" + queryParse.events.event[i].start_time + "</p>"
      var date = moment(startTime, 'YYYY-MM-DD HH:mm:ss').format('MMM D, YYYY h:mm a')
      var eventfulLink = "<p><a href='" + queryParse.events.event[i].url + "'target='" + "_blank'>" + "Event Link" + "</a></p>"
      var image = $('<img>')
      image.addClass('eventImg')
      div.append(title)
      div.append(date + "<br><br>")
      div.append("<b>Description: </b><br><br>" + description + "<br>")
      
      if (queryParse.events.event[i].image === null) {
      }
      else {
        var imageURL = image.attr('src', "http:" + queryParse.events.event[i].image.url)
        div.append(imageURL)
      }
      div.append(eventfulLink + "<br>")
      div.addClass('card-panel teal lighten-5 boxsize')
      $("#content").append(div)
    }
  })
  return false
  //   }).catch(function(err){
  //       console.log(err)
})

