export function initMap() {
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
        icon: 'https://img.icons8.com/fluent/48/000000/marker-storm.png',
        draggarble: true
      });
    }, function() {
      handleLocationError(true, map ? map.getCenter() : null);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, null);
  }
  var information = new google.maps.InfoWindow({
    content: '<h4>New Marker</h4>'
  });
  marker.addListener('click', function() {
    information.open(map, marker);
  });
  return map;
}

export function handleLocationError(browserHasGeolocation, initialLocation) {
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


