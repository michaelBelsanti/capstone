export function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            map = new google.maps.Map(document.getElementById('map'), {
                center: initialLocation,
                zoom: 14,
                fullscreenControl: false
            });

            // Customize the map as needed

            var marker = new google.maps.Marker({
                position: initialLocation,
                map: map,
                title: 'You are here!'
            });

            // Create a request object to search for nearby parks
            const request = {
                location: map.getCenter(),
                radius: 5000, // Search radius in meters (adjust as needed)
                type: ["park"], // Limit search to parks
            };

            // Create a Places service object
            const service = new google.maps.places.PlacesService(map);

            // Perform the search and display markers
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        const place = results[i];
                        const marker = new google.maps.Marker({
                            map: map,
                            position: place.geometry.location,
                            title: place.name,
                            icon: {
                                url: "https://image.pngaaa.com/900/2340900-middle.png"
                            }
                        });
                    }
                } else {
                    console.error("Places service error:", status);
                }
            });
        }, function() {
            handleLocationError(true, map ? map.getCenter() : null);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, null);
    }

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
/*
 
*/