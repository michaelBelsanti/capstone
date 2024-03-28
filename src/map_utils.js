export function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      map = new google.maps.Map(document.getElementById('map'), {
        center: initialLocation,
        zoom: 14,
        fullscreenControl: false,
        styles: [
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          }
        ]
      });

      // Customize the map as needed
      var marker = new google.maps.Marker({
        position: initialLocation,
        map: map,
        title: 'You are here!'
      });

      var information = new google.maps.InfoWindow({
        content: '<h4>New Marker</h4>'
      });

      marker.addListener('click', function() {
        information.open(map, marker);
      });

    }, function() {
      handleLocationError(true, map ? map.getCenter() : null);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, null);
  }

// Get references to your buttons
const parkButton = document.querySelector('button[data-type="Parks"]');
const hikingButton = document.querySelector('button[data-type="Hiking Areas"]');
const landmarkButton = document.querySelector('button[data-type="Historical Landmarks"]');
const clearMarkersButton = document.getElementById('clearMarkersButton');

// Attach click event listeners to the buttons
parkButton.addEventListener('click', () => searchForParks('park'));
hikingButton.addEventListener('click', () => searchForParks('hiking_area'));
landmarkButton.addEventListener('click', () => searchForParks('natural_feature'));
clearMarkersButton.addEventListener('click', clearMarkers);

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
      zoom: 14,
    });
  }
};
//TODO: Update function name to searchByType
export function searchForParks(locationType) {
  // Create a request object to search for nearby parks
  const request = {
    location: map.getCenter(),
    radius: 5000, // Search radius in meters (adjust as needed)
    type: [locationType], // Limit search to the specified type
  };

  // Create a Places service object
  const service = new google.maps.places.PlacesService(map);

  // Define a color map for the different location types
  const colorMap = {
    park: 'green',
    hiking_area: 'blue',
    natural_feature: 'red',
  };

  // Get the color for the current location type
  const color = colorMap[locationType] || 'green'; // Default to green if no color is defined

  // Perform the search and display markers
  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];

        // Filter out places that are not the specified type
        if (place.types.includes(locationType)) {
          const marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: place.name,
            icon: {
              url: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
            },
          });
          markers.push(marker); // Add the marker to the markers array
        }
      }
    } else {
      console.error("Places service error:", status);
    }
  });
}

let markers = []; // Create an array to store markers

export function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // Remove the marker from the map
  }
  markers = []; // Clear the markers array
}
