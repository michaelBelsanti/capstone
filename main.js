import Alpine from 'alpinejs'
import { initMap } from './src/map_utils'
import "./style.css"

window.Alpine = Alpine
Alpine.start()

var map = initMap()
