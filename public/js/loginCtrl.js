var loginCtrl = angular.module('loginCtrl', ['geolocation', 'gservice']);

loginCtrl.controller('loginCtrl', function($scope, $http, $rootScope, $window, geolocation, gservice){


  // Creates a new user based on the form fields
  $scope.createUser = function() {
      var userData = {
        username: $scope.formData.username,
        password: $scope.formData.password,
        favlang: "My first location",
        vote: 0,
        location: [$scope.formData.latitude, $scope.formData.latitude]
      };

      queryBody = {
          username: $scope.formData.username,
          favlang: "TAMIL"
      };

      // Validate whether use is available
      $http.post('/query', queryBody)
          .success(function (data) {
              var result = JSON.parse(angular.toJson(data, true));

              if((result[0] != null) && (result[0].username.toLowerCase() === $scope.formData.username.toLowerCase()))
              {
                  $window.alert("User already registered, Please try Login");
              }
          })
          .error(function (data) {
          });

      // Saves the user data to the db
      $http.post('/users', userData)
          .success(function (data) {

              // Once complete, clear the form (except location)
              gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
              $window.alert("Registration Successful, login now!!!");
          })
          .error(function (data) {
              $window.alert("Registration Failed");
          });
  };

  $scope.validateUser = function() {
    // Assemble Query Body
    queryBody = {
        username: $scope.formData.username,
        favlang: "TAMIL"
    };

    // Reads the user data to the db
    $http.post('/query', queryBody)
        .success(function (data) {
            gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
            console.log('Success: ' + angular.toJson(data, true));
            var result = JSON.parse(angular.toJson(data, true));

            if((result[0] != null) && (result[0].username.toLowerCase() === $scope.formData.username.toLowerCase()) &&
                (result[0].password === $scope.formData.password))
            {
                if(sessionStorage){
                    // Store data
                    sessionStorage.setItem("username", $scope.formData.username);
                    sessionStorage.setItem("password", $scope.formData.password);
                }

                $window.location.href = '/#/join';
                $window.location.reload();
            }
            else {
              $window.alert("Please Register or key in valid credentials");
            }
        })
        .error(function (data) {
            console.log('Error: ' + data);
            $window.alert("Please Register");
        });
  };

});
