import Alpine from 'alpinejs'
import { initMap } from './map_utils'
import './index.css'

window.Alpine = Alpine
Alpine.start()
console.log("Alpine has been started.")

// Initialize the map
var map = initMap()
