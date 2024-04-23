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

      // Initialize the map centered at the first location
      map = new google.maps.Map(document.getElementById('map'), {
        center: {
          lat: 39.9526,
					lng: -75.1652
        },
        zoom: 10
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


// export function handleLocationError(browserHasGeolocation, initialLocation) {
//   var error = browserHasGeolocation ?
//     'Error: The Geolocation service failed.' :
//     'Error: Your browser doesn\'t support geolocation.';
//   alert(error);
//   if (initialLocation) {
//     map = new google.maps.Map(document.getElementById('map'), {
//       center: initialLocation,
//       zoom: 14,
//     });
//   }
// };

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

// // Fetches markers from the database and displays them on the map
// function fetchMarkers() {
//   fetch('https://api.belsanti.dev/markers/get', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data)
//     // Loop through the data and create a marker for each one
//     data.forEach((markerData) => {
      
      
//       let markerPosition = new google.maps.LatLng(markerData.latitude, markerData.longitude);
//       let marker = new google.maps.Marker({
//         position: markerPosition,
//         setMap: map,
//         title: markerData.title
//       });
//       let infoWindow = new google.maps.InfoWindow({
//         content: '<h4>' + markerData.title + '</h4><p>' + markerData.description + '</p>'
//       });
//       marker.addListener('click', function() {
//         infoWindow.open(map, markerData);
//       });
//       console.log(markerData.latitude)
//       console.log(markerData.longitude)
      
//       placeMarker(markerPosition, map, 'Custom Marker', 'TESTING');
//     })
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
// }


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
