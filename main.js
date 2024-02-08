import Alpine from 'alpinejs'
import "./style.css"

window.Alpine = Alpine
Alpine.start()

var map;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map = new google.maps.Map(document.getElementById('map'), {
        center: initialLocation,
        zoom: 14
      });
      // Customize the map as needed
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: 'You are here!'
      });
    }, function() {
      handleLocationError(true, map ? map.getCenter() : null);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, null);
  }
}

function handleLocationError(browserHasGeolocation, initialLocation) {
  var error = browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.';
  alert(error);
  if (initialLocation) {
    map = new google.maps.Map(document.getElementById('map'), {
      center: initialLocation,
      zoom: 14
    });
  }
}

initMap()
