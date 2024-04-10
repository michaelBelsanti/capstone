let markers = [];

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
            "elementType": "labels",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.neighborhood",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi.business",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
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

      // Add a click event listener to the map to drop a marker when clicked
      google.maps.event.addListener(map, 'click', function(event) {
        var clickedLocation = event.latLng;
        placeMarker(clickedLocation, map, 'Custom Marker', 'Clicked Coordinates: ' + clickedLocation.lat() + ', ' + clickedLocation.lng());
      });

    }, function() {
      handleLocationError(true, map ? map.getCenter() : null);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, null);
  }

  // Get references to buttons
  const parkButton = document.querySelector('button[data-type="Parks"]');
  const hikingButton = document.querySelector('button[data-type="Hiking Areas"]');
  const landmarkButton = document.querySelector('button[data-type="Historical Landmarks"]');
  const clearMarkersButton = document.getElementById('clearMarkersButton');

  // Attach click event listeners to the buttons
  parkButton.addEventListener('click', () => searchForParks('park'));
  hikingButton.addEventListener('click', () => searchForParks('hiking_area'));
  landmarkButton.addEventListener('click', () => searchForParks('natural_feature'));
  clearMarkersButton.addEventListener('click', clearMarkers);

  fetchMarkers();
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

export function clearMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // Remove the marker from the map
  }
  markers = []; // Clear the markers array
}


function placeMarker(location, map, title, content) {
  
  var marker = new google.maps.Marker({
    position: location,
    map: map,
    title: title
  });

  markers.push({
    location: location,
    title: title
  });

  // Show starting and ending coordinates in a pop-up menu
  if (markers.length > 1) {
    var startLocation = markers[markers.length - 2].location;
    var endLocation = markers[markers.length - 1].location;
    var infoContent = 'Start Coordinates: ' + startLocation.lat() + ', ' + startLocation.lng() +
      '<br>End Coordinates: ' + endLocation.lat() + ', ' + endLocation.lng();

    var infowindow = new google.maps.InfoWindow({
      content: infoContent
    });

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  }
  
}

// POSTS markers to database with info from sidebar
function handleSubmit() {
  // Extract the data from the form
  var title = document.getElementById('NewMarkerTitle').value;
  var description = document.getElementById('NewMarkerDescription').value;
  var category = document.getElementById('NewMarkerCategory').value;

  // Create an object with the data
  var data = {
    title: title,
    description: description,
    category: category
  };

  // Send a POST request with the data
  fetch('https://capstone.belsanti.dev/api/markers/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch((error) => {
    console.error('Error:', error);
  });
}
// document.getElementById('POSTmarkers').addEventListener('click', handleSubmit());

// Fetches markers from the database and displays them on the map
function fetchMarkers() {
  fetch('https://api.belsanti.dev/markers/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Loop through the data and create a marker for each one
    data.forEach((markerData) => {
      let markerPosition = new google.maps.LatLng(markerData.latitude, markerData.longitude);
      let marker = new google.maps.Marker({
        position: markerPosition,
        map: map,
        title: markerData.title
      });
      let infoWindow = new google.maps.InfoWindow({
        content: '<h4>' + markerData.title + '</h4><p>' + markerData.description + '</p>'
      });
      marker.addListener('click', function() {
        infoWindow.open(map, markerData);
      });
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


// Add the event listener to the button
// document.getElementById('POSTmarkers').addEventListener('click', handleSubmit);


// ARCHIVING IN CASE I MESS SOMETHING UP
// Definitely lets me add more markers, just doesn't clear old ones
// function placeMarker(location, map, title, content) {
//   var marker = new google.maps.Marker({
//     position: location,
//     map: map,
//     title: title
//   });

//   markers.push({
//     location: location,
//     title: title
//   });

//   // Show starting and ending coordinates in a pop-up menu
//   if (markers.length > 1) {
//     var startLocation = markers[markers.length - 2].location;
//     var endLocation = markers[markers.length - 1].location;
//     var infoContent = 'Start Coordinates: ' + startLocation.lat() + ', ' + startLocation.lng() +
//       '<br>End Coordinates: ' + endLocation.lat() + ', ' + endLocation.lng();

//     var infowindow = new google.maps.InfoWindow({
//       content: infoContent
//     });

//     marker.addListener('click', function() {
//       infowindow.open(map, marker);
//     });
//   }
// }
