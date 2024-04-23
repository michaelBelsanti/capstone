// Existing JSON array with location information and images
var locations = [];

var map;
var markers = [];
var locationInput = document.getElementById('location');
var setMarkerMode = false;

export function initMap() {
  fetchJsonData()
    .then(data => {
      locations = data;

      // Initialize the map centered at the user's current location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          map = new google.maps.Map(document.getElementById('map'), {
            center: initialLocation,
            zoom: 15
          });

          // Add markers and info windows for each location
          locations.forEach(function(location) {
            var latLng = {
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude)
            };

            var marker = new google.maps.Marker({
              position: latLng,
              map: map,
              title: location.title
            });

            marker.addListener('click', function() {
              // Open an info window when marker is clicked
              var infoWindow = new google.maps.InfoWindow({
                content: '<div><h2>' + location.title + ', (' + location.category + ')</h2><p>' + location.description + '</p><img src="' + location.image + '" width="200"></div>'
              });
              infoWindow.open(map, marker);
            });
          });

          // Add click event listener to the map for setting location
          map.addListener('click', function(event) {
            if (setMarkerMode) {
              setLocationFromMap(event.latLng);
            }
          });
        }, function() {
          // If geolocation is not available, use the default location
          map = new google.maps.Map(document.getElementById('map'), {
            center: {
              lat: 39.9526,
              lng: -75.1652
            },
            zoom: 10
          });

          // Add markers and info windows for each location
          locations.forEach(function(location) {
            // ...
          });

          // Add click event listener to the map for setting location
          map.addListener('click', function(event) {
            if (setMarkerMode) {
              setLocationFromMap(event.latLng);
            }
          });
        });
      } else {
        // If the browser doesn't support geolocation, use the default location
        map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 39.9526,
            lng: -75.1652
          },
          zoom: 10
        });

        // Add markers and info windows for each location
        locations.forEach(function(location) {
          // ...
        });

        // Add click event listener to the map for setting location
        map.addListener('click', function(event) {
          if (setMarkerMode) {
            setLocationFromMap(event.latLng);
          }
        });
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

//Fetches JSON array
async function fetchJsonData() {
  const apiUrl = 'https://api.belsanti.dev/markers/get';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    // Get the JSON data from the response
    const jsonData = await response.json();

    return jsonData;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Rethrow the error for better error handling
  }
}

export function setLocation() {
  setMarkerMode = true;
  locationInput.value = '';
}

export function setLocationFromMap(latLng) {
  setMarkerMode = false;
  locationInput.value = latLng.lat() + ', ' + latLng.lng();
}

export function addLocation() {
  var title = document.getElementById('title').value;
  var description = document.getElementById('description').value;
  var location = document.getElementById('location').value;
  var image = document.getElementById('image').value;

  if (city && state && location && image && about) {
    var newLocation = {
      "title": title,
      "description": description,
      "image": image,
      "location": location,
    };

    locations.push(newLocation);
    alert(JSON.stringify(locations));
    addMarker(newLocation);

    // Clear the form inputs
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
    document.getElementById('image').value = '';
  }
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

export function addMarker(location) {
  var latLng = {
    lat: parseFloat(location.location.split(',')[0]),
    lng: parseFloat(location.location.split(',')[1])
  };

  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: location.city
  });

  var content = '<div class="info-window-content">' +
          '<div><strong>' + location.city + ', ' + location.state + '</strong></div><br>' +
          '<img class="info-window-image" src="' + location.image + '" alt="' + location.city + '">' +
          '<div>' + location.about + '</div>' +
          '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: content
  });

  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  markers.push(marker);
}