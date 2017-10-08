// Creates the addCtrl Module and Controller.
var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, $window, geolocation, gservice){

    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates to the center of the US
    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Functions
    // ----------------------------------------------------------------------------
    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });

    // Get coordinates based on mouse click. When a click event is detected....
    $rootScope.$on("clicked", function(){

        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
            $scope.formData.favlang = gservice.description;
            console.log("scope.formData.latitude : " + $scope.formData.latitude);
            console.log("scope.formData.longitude : " + $scope.formData.longitude);
            gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
        });
    });

    $scope.createnewlocation = function(){

         var voutecount = 0;
        // Perform an AJAX call to get all of the records in the db.
        $http.get('/users').success(function(response){

          for(let i= 0; i < response.length; i++) {
              if((response[i].location[0] == $scope.formData.longitude) && (response[i].location[1] == $scope.formData.latitude))
              {
                  if (response[i].vote > 0)
                  {
                      voutecount++;
                  }
              }
          }

          console.log("Votecount : " + voutecount);

          var userData = {
              username: sessionStorage.getItem("username"),
              password: sessionStorage.getItem("password"),
              vote: ($scope.formData.vote == "Yes") ? ++voutecount:0,
              favlang: $scope.formData.favlang,
              location: [$scope.formData.longitude,$scope.formData.latitude]
          };

          console.log("Data " + JSON.stringify(userData));

          $http.post('/users', userData)
              .success(function (data) {
                  $window.alert("Location Added successfully");
                  gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
              })
              .error(function (data) {
                  $window.alert("Location not added");
              });

        }).error(function(){});
    };

    $rootScope.showwishlist = function(){
          console.log("Here is your list");
          // Assemble Query Body
          queryBody = {
              username: sessionStorage.getItem("username")
          };
          document.getElementById("wishlist").innerHTML = "";
          // Post the queryBody to the /query POST route to retrieve the filtered results
          $http.post('/query', queryBody)

              // Store the filtered results in queryResults
              .success(function(queryResults){

                  // Query Body and Result Logging
                  console.log("QueryBody:");
                  console.log(JSON.stringify(queryBody));
                  console.log("QueryResults:");
                  var result = JSON.parse(angular.toJson(queryResults, true));
                  console.log(result);

                  // Count the number of records retrieved for the panel-footer
                  // $scope.queryCount = queryResults.length;
                  gservice.refresh($scope.formData.latitude, $scope.formData.longitude, queryResults);
                  gservice.getAddress(queryResults);
              })
              .error(function(queryResults){
                  console.log('Error ' + queryResults);
              })
    };

    $rootScope.showpopularlist = function() {
      // Get all users
      $http.get('/users').success(function(response){
        var userdata = [];
        for(let i= 0; i < response.length; i++) {
          if (response[i].vote > 5)
          {
              userdata.push(response[i]);
          }
        }
        document.getElementById("wishlist").innerHTML = "";
        gservice.getAddress(userdata);
    });
  };

});
