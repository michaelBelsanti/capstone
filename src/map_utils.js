import { dark_styles, light_styles } from './map_style'
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Existing JSON array with location information and images
var locations = [];
var map;
var markers = [];
var currentMarkerLocation;

// Function to update the map styles
function updateMapStyles(event, map) {
  if (event.matches) {
    map.setOptions({ styles: dark_styles });
  } else {
    map.setOptions({ styles: light_styles });
  }
}

export function initMap() {
  fetchJsonData()
    .then(locations => {

      // Initialize the map centered at the user's current location if available
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          console.log(isDarkMode)
          map = new google.maps.Map(document.getElementById('map'), {
            center: initialLocation,
            zoom: 15,
            styles: isDarkMode ? dark_styles : light_styles
          });
          darkModeMediaQuery.addEventListener('change', (event) => updateMapStyles(event,map));

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
              var infoWindowContent = '<div><h2>' + location.title + ', (' + location.category + ')</h2><p>' + location.description + '</p>';

              // Check if valid is true and if image is provided
              console.log(location.image.Valid)
              if (location.image.Valid) {
                infoWindowContent += '<img src="data:image/jpeg;base64,' + location.image.String + '" width="200">';
              }

              infoWindowContent += '</div>';

              var infoWindow = new google.maps.InfoWindow({
                content: infoWindowContent
              });
              infoWindow.open(map, marker);
            });
          });

          // Add click event listener to the map for setting location
          map.addListener('click', function(event) {
            setLocationFromMap(event.latLng);
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

          // Add click event listener to the map for setting location
          map.addListener('click', function(event) {
              setLocationFromMap(event.latLng);
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

export function setLocationFromMap(latLng) {
  console.log(latLng.lat());
  console.log(latLng.lng());
  document.getElementById('NewMarkerLat').setAttribute("value", latLng.lat());
  document.getElementById('NewMarkerLong').setAttribute("value", latLng.lng());

  // Clear the previous marker
  if (currentMarkerLocation) {
    currentMarkerLocation.setMap(null);
  }

  // Create a new marker
  currentMarkerLocation = new google.maps.Marker({
    position: latLng,
    map: map
  });
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

export function addMarker(locationData) {
  var latLng = {
    lat: parseFloat(locationData.latitude),
    lng: parseFloat(locationData.longitude)
  };


  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    title: locationData.title
  });

  marker.addListener('click', function() {
    // Open an info window when marker is clicked
    var infoWindowContent = '<div><h2>' + locationData.title + ', (' + locationData.category + ')</h2><p>' + locationData.description + '</p>';

    // Check if valid is true and if image is provided
    infoWindowContent += '<img src="data:image/jpeg;base64,' + locationData.image + '" width="200">';

    infoWindowContent += '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    infoWindow.open(map, marker);
  });
}
