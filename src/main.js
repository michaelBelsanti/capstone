import Alpine from 'alpinejs'
import { initMap } from './map_utils'
import './index.css'

window.Alpine = Alpine
window.handleSubmit = handleSubmit;
Alpine.start()
console.log("Alpine has been started.")

// Initialize the map
var map = initMap()

// POSTS markers to database with info from sidebar
function handleSubmit() {
  // Extract the data from the form
  var title = document.getElementById('NewMarkerTitle').value;
  var description = document.getElementById('NewMarkerDescription').value;
  var category = document.getElementById('NewMarkerCategory').value;

  // Create an object with the data
  var data = {
    // TODO
    longitude: null,
    latitude: null,
    title: title,
    description: description,
    category: category
  };

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
}
