
var map, infoWindow
function initMap() {
  // map = new google.maps.Map($('#map'), {
  //   center: {lat: -34.397, lng: 150.644},
  //   zoom: 6
  // })
  infoWindow = new google.maps.InfoWindow
}
var locationDefault = function () {
  var pos
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      console.log("Lattitude: " + pos.lat + "; Longitude: " + pos.lng)

      $.ajax({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        data: {
          'latlng': pos.lat + ", " + pos.lng
        },
        dataType: 'json',

        success: function (r) {
          console.log('Success', r)
        },
        error: function (e) {
          console.log('Error', e)
        }

      }).then(function (response) {
        console.log("Current Location:  " + response.results[1].formatted_address)
        $("#locationSearch").attr("value", response.results[1].formatted_address)
      })
    })
  }
}

$(".submitBTN").on('click', function () {
  $("#content").empty()
  var dataSearch = $(this).attr("data-search")
  $("#eventSearch").attr('value', dataSearch)
  var querySearch = $("#eventSearch").val().trim()

  console.log('===========================================')
  console.log('Keyword: ' + querySearch)
  var queryLocation = $("#locationSearch").val().trim()
  console.log('Location: ' + queryLocation)
  console.log('===========================================')

  if (queryLocation.length < 1) {
    $(".text").text("Please input a location above")
  }
  else {
    $(".userInput").fadeOut()
    $.ajax({
      url: "https://crossorigin.me/http://api.eventful.com/json/events/search?keywords=" + querySearch + "&location=" + queryLocation + "&future=Future&app_key=mW7nqRDmDzZsdTFH",
      method: "GET"

    }).then(function (response) {

      var queryParse = JSON.parse(response)
      for (i = 0; i < 10; i++) {

        if (queryParse.events === null) {
          $("<body>").append("<h1>Sorry no events around you</h1>")
        }
        else {
          console.log((i + 1) + ". " + queryParse.events.event[i].title)
          console.log(queryParse.events.event[i])
          var div = $('<div>')
          var title = "<h5><b>" + (i + 1) + ". " + queryParse.events.event[i].title + "<b></h5><hr>"
          var venueAddr = queryParse.events.event[i].venue_address
          var venueName = queryParse.events.event[i].venue_name
          var description = "<p>" + queryParse.events.event[i].description + "</p>"
          var startTime = "<p>" + queryParse.events.event[i].start_time + "</p>"
          var date = moment(startTime, 'YYYY-MM-DD HH:mm:ss').format('MMM D, YYYY h:mm a')
          var eventfulLink = "<p><a class='btn indigo lighten-2' href='" + queryParse.events.event[i].url + "'target='" + "_blank'>" + "Eventful Link" + "</a></p>"
          var image = $('<img>')
          image.addClass('eventImg')
          div.append(title)
          div.append(venueName + "<br>")
          div.append(venueAddr + "<br>")
          div.append(date + "<br><br>")
          if (queryParse.events.event[i].description === null) {
            div.append("<b>Description: </b>N/A<br><br>")
          }
          else {
            div.append("<b>Description: </b><br>" + description + "<br>")
          }
          if (queryParse.events.event[i].image === null) {
            console.log("Image is Null")
          }
          else {
            var imageURL = image.attr('src', "http:" + queryParse.events.event[i].image.url)
            div.append(imageURL)
          }
          div.append(eventfulLink + "<br>")
          div.addClass('card-panel hoverable boxchar col s3')
          $("#content").append(div)
        }
      }
    })
    return false
  }
})
