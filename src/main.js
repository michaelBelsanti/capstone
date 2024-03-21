import Alpine from 'alpinejs'
import { initMap } from './map_utils'

window.Alpine = Alpine
Alpine.start()
console.log("Alpine has been started.")

var map = initMap()
window.initAutocomplete = initAutocomplete;