$('.gContainer').hide()
//---Google Geolocating and Google Maps API---
var map, infoWindow, marker
function initMap() {
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

      //---Google Map with Marker IF user accepts to allow 'use location'---
      $('.gContainer').show()
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: pos.lat, lng: pos.lng }
      })
      marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: { lat: pos.lat, lng: pos.lng }
      })
      //---if user clicks marker, the marker bounces---
      marker.addListener('click', toggleBounce);
      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        //---end Google Map---
      }
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
        console.log("Current Location:  " + response.results[2].formatted_address)
        $("#locationSearch").attr("value", response.results[2].formatted_address)
      })
    })
  }
}

//---Preloader to show user ajax call currently in process---
$('#preloader').hide()

//---Eventful API---
$(".submitBTN").on('click', function () {
  $("#content").empty()
  //---Carousel Pre-defined Event Search---
  var dataSearch = $(this).attr("data-search")
  $("#eventSearch").attr('value', dataSearch)
  //---Event Custom Search Parameters---
  var querySearch = $("#eventSearch").val().trim()
  var queryLocation = $("#locationSearch").val().trim()

  console.log('===========================================')
  console.log('Keyword: ' + querySearch)
  console.log('Location: ' + queryLocation)
  console.log('===========================================')

  //---if no location is populated, change text to prompt user on HTML to provide location---
  if (queryLocation.length < 1) {
    $(".text").text("Please input a location above")
  }
  else {
    //---if all search parameters populated, then hide everything, show preloader until ajax call is completed---
    $(".userInput").fadeOut()
    $(".gContainer").hide()
    $('#preloader').show()
    $.ajax({
      url: "https://crossorigin.me/http://api.eventful.com/json/events/search?keywords=" + querySearch + "&location=" + queryLocation + "&future=Future&app_key=mW7nqRDmDzZsdTFH",
      method: "GET"
    }).then(function (response) {
      //Convert stringified JSON to true JSON for object manipulation
      var queryParse = JSON.parse(response)
      for (i = 0; i < 10; i++) {
        //If no events, display in body that there are no events
        if (queryParse.events === null) {
          $("<body>").append("<h1>Sorry no events around you</h1>")
        }
        else {
          //Structure for displaying eventful information Image > Title  > Venue Name > Venue Address > Date&Time > Description > Link
          console.log((i + 1) + ". " + queryParse.events.event[i].title)
          console.log(queryParse.events.event[i])
          var div = $('<div>')
          var title = "<h5><b>" + (i + 1) + ". " + queryParse.events.event[i].title + "<b></h5><hr>"
          var venueName = queryParse.events.event[i].venue_name
          var venueAddr = queryParse.events.event[i].venue_address
          var description = "<p>" + queryParse.events.event[i].description + "</p>"
          var startTime = "<p>" + queryParse.events.event[i].start_time + "</p>"
          var date = moment(startTime, 'YYYY-MM-DD HH:mm:ss').format('MMM D, YYYY h:mm a')
          var eventfulLink = "<p><a class='btn indigo lighten-2' href='" + queryParse.events.event[i].url + "'target='" + "_blank'>" + "Eventful Link" + "</a></p>"
          var image = $('<img>')
          image.addClass('eventImg')

          // var imageBing
          // $.ajax({
          //   url: "https://api.cognitive.microsoft.com/bing/v7.0/images/search&q=" + queryParse.events.event[i].title,

          //   // Request headers.
          //   beforeSend: function(xhrObj){
          //     xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "1d3a95366e404d818c1ef8d5b63587cb")
          //   },
          //   method: "GET"
          // }).then(function (response) {
          //   console.log(response)
          //   console.log("Bing Image URL: " + response.url)
          // })

          if (queryParse.events.event[i].image === null) {
            console.log("Image is Null")
          }
          else {
            var imageURL = image.attr('src', "http:" + queryParse.events.event[i].image.medium.url)
            div.append(imageURL)
          }
          div.append(title)
          div.append(venueName + "<br>")
          div.append(venueAddr + "<br>")
          div.append(date + "<br><br>")
          if (queryParse.events.event[i].description === null) {
            div.append("<b>Description: </b>No description for this event<br><br>")
          }
          else {
            div.append("<b>Description: </b><br>" + description + "<br>")
          }
          div.append(eventfulLink + "<br>")
          div.addClass('card-panel hoverable boxchar eventbox-' + i + ' col s3')
          /*---------------Future Enhancement to include Modals when user clicks on specific event -*/
          // div.append("<a class='modal-trigger' href='#modal" + i + "'> Modal</a>")
          /*---------------------------------------------------------------------------------------*/
          $("#content").append(div)
          $('#preloader').hide()
          $('.gContainer').show()
          $('#glocation').text('Your events near you!')
      

          locations.push([(queryParse.events.event[i].latitude), (queryParse.events.event[i].longitude)])

          /*---------------Future Enhancement to include Events Around You-------------------------*/
            // var infowindow = new google.maps.InfoWindow();
            // var marker

            // marker = new google.maps.Marker({
            //   // position: new google.maps.LatLng(locations[i][0], locations[i][1]),
            //   position: { lat: parseFloat(locations[i][0]), lng: parseFloat(locations[i][1]) },
            //   map: map
            // });
          /*---------------------------------------------------------------------------------------*/
        }
      }
    })
    //Prevent refresh on submit
    return false
  }
})

var locations = []
console.log(locations)