import Alpine from 'alpinejs'
import { initMap } from './map_utils'
import "./style.css"

window.Alpine = Alpine
Alpine.start()

var map;

map = initMap()
