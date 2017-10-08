// Declares the initial angular module "meanMapApp". Module grabs other controllers and services.
var app = angular.module('meanMapApp', ['loginCtrl', 'addCtrl', /*'queryCtrl',*/ 'geolocation', 'gservice', 'ngRoute'])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($routeProvider){

      $routeProvider.when('/login', {
          controller: 'loginCtrl',
          templateUrl: 'partials/login.html',
      }).when('/join', {
            controller: 'addCtrl',
            templateUrl: 'partials/addForm.html',
        })/*.when('/find', {
            controller: 'queryCtrl',
            templateUrl: 'partials/queryForm.html',
        })*/.otherwise({redirectTo:'/login'})
    });
