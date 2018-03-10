
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
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
      console.log("lattitude:  " + pos.lat)
      console.log("longitude:  " + pos.lng)
      
      $.ajax({
        url : 'https://maps.googleapis.com/maps/api/geocode/json',
        data : {
          'latlng' : pos.lat + ", " + pos.lng  
        },
        dataType : 'json',
        
        success: function(r){  
          console.log('success', r)
        },
        error: function(e){ 
          console.log('error', e)
        }
        
      }).then (function(response) {
        console.log ("location:  " + response.results[1].formatted_address)
        $("#locationSearch").attr("value", response.results[1].formatted_address)
      })
    })
    }
  }
  
$(".submitBTN").on('click', function () {
  $("#content").empty()
  // $(".userInput").hide()
  var querySearch = $("#eventSearch").val().trim()
  console.log('Search Keyword:' + querySearch)
  var queryLocation = $("#locationSearch").val().trim()
  console.log(queryLocation)
  var queryDate = "future"
  if (queryLocation.length < 1){
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
  
        console.log(queryParse)
        if (queryParse.events === null) {
          $("<body>").append("<h1>Sorry no events around you</h1>")
        }
        else {
          console.log(queryParse.events.event[i])
          console.log(queryParse.events.event[i].title)
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
      }
    })
    return false
    //   }).catch(function(err){
    //       console.log(err) 
  }
})



  // <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBGKzK10pnII1YoVFkujW3oEbCJaiCLwrs&callback=initMap"
  //   async defer></script>