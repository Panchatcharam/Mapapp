// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // Array of locations obtained from API calls
        var locations = [];

        // Selected Location (initialize to center of America)
        var selectedLat = 39.50;
        var selectedLong = -98.35;

        // Handling Clicks and location selection
        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;
        googleMapService.description = '';

        // Functions
        // --------------------------------------------------------------
        // Refresh the Map with new data. Takes three parameters (lat, long, and filtering results)
        googleMapService.refresh = function(latitude, longitude, filteredResults){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // If filtered results are provided in the refresh() call...
            if (filteredResults){

                // Then convert the filtered results into map points.
                locations = convertToMapPoints(filteredResults);

                // Then, initialize the map -- noting that a filter was used (to mark icons yellow)
                initialize(latitude, longitude, true);
            }

            // If no filter is provided in the refresh() call...
            else {

                // Perform an AJAX call to get all of the records in the db.
                $http.get('/users').success(function(response){

                    // Then convert the results into map points
                    locations = convertToMapPoints(response);

                    // Then initialize the map -- noting that no filter was used.
                    initialize(latitude, longitude, false);
                }).error(function(){});
            }
        };

        googleMapService.getAddress = function(input) {
          var geocoder = new google.maps.Geocoder();
            for(let i= 0; i < Object.keys(input).length; i++) {
                var latlng = new google.maps.LatLng(input[i].location[1], input[i].location[0]);
                geocoder.geocode(
                {'latLng': latlng},
                function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                            console.log("Geocoder successful ");
                            if (results[0]) {
                                var add= results[0].formatted_address;
                                var para = document.createElement("p");
                                para.appendChild(document.createTextNode((i+1) + '. ' + results[0].formatted_address));
                                var element = document.getElementById("wishlist");
                                element.appendChild(para);
                                console.log(para);
                                document.getElementById('wishlist').style.fontSize = '1em';
                            }
                            else  {
                            }
                    }
                     else {
                        console.log("Geocoder failed due to: " + status);
                    }
                }
              );
          }
        };


        // Private Inner Functions
        // --------------------------------------------------------------
        // Convert a JSON of users into map points
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString =
                    '<p><b>Username</b>: ' + user.username +
                    '<br><b>Description</b>: ' + user.favlang +
                    '</p>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    favlang: user.favlang,
                    votecount:user.vote
            });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude, filter) {

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};

        // If map has not been created...
        if (!map){

            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: myLatLng
            });
        }

        // Loop through each location in the array and place a marker
        locations.forEach(function(n, i){
            if(n.votecount > 5) {
              icon = "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
            }
            else {
              if(filter){
                  icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
              }
              else{
                  icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
              }
            }

            var marker = new google.maps.Marker({
                position: n.latlon,
                map: map,
                title: "select",
                icon:icon
            });

            // For each marker created, add a listener that checks for clicks
            google.maps.event.addListener(marker, 'click', function(e){

                // When clicked, open the selected marker's message
                currentSelectedMarker = n;
                n.message.open(map, marker);

                googleMapService.clickLat = marker.getPosition().lat();
                googleMapService.clickLong = marker.getPosition().lng();
                googleMapService.description = currentSelectedMarker.favlang;
                console.log("map : " + map);
                console.log("marker : " + marker);
                $rootScope.$broadcast("clicked");
            });
        });

        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: initialLocation,
            animation: google.maps.Animation.DROP,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        lastMarker = marker;

        // Function for moving to a selected location
        map.panTo(new google.maps.LatLng(latitude, longitude));

        // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', function(e){
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.DROP,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });

            // When a new spot is selected, delete the old red bouncing marker
            if(lastMarker){
                lastMarker.setMap(null);
            }

            // Create a new red bouncing marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            // Update Broadcasted Variable (lets the panels know to change their lat, long values)
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            $rootScope.$broadcast("clicked");
        });
    };

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});
