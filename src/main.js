import Alpine from 'alpinejs'
import { initMap, addMarker } from './map_utils'
import './index.css'

window.Alpine = Alpine
window.handleSubmit = handleSubmit

Alpine.start()
console.log("Alpine has been started.")

// Initialize the map
var map = initMap()

// POSTS markers to database with info from sidebar
function handleSubmit() {
  var title = document.getElementById('NewMarkerTitle').value;
  var lat = document.getElementById('NewMarkerLat').value;
  var long = document.getElementById('NewMarkerLong').value;
  var description = document.getElementById('NewMarkerDescription').value;
  var category = document.getElementById('NewMarkerCategory').value;
  var imageFile = document.getElementById('ImageUploadInput').files[0];

  // Convert the image file to base64
  var reader = new FileReader();
  reader.readAsDataURL(imageFile);
  reader.onload = function() {
    var base64Image = reader.result.split(',')[1];
    console.log(base64Image)

    // Create an object with the data including the base64 image
    var data = {
      latitude: lat,
      longitude: long,
      title: title,
      description: description,
      category: category,
      image: base64Image,
    };

    addMarker(data)

    document.getElementById('NewMarkerTitle').value = null;
    document.getElementById('NewMarkerDescription').value = null;
    document.getElementById('NewMarkerCategory').value = null;

    // Send a POST request with the data
    fetch('https://capstone.belsanti.dev/markers/add', {
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
  };
  reader.onerror = function(error) {
    console.error('Error reading file:', error);
  };
}
