'use strict';

angular.module('NodeJsMessengerBot.DashboardCtrl', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages'])

  .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      css: 'views/dashboard/dashboard.css'
    })
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default').primaryPalette('teal');

  }])

  .controller('DashboardCtrl', ['$scope', 'GeneralService', '$interval', '$window', '$location', function ($scope, GeneralService, $interval, $window, $location) {

    $scope.msgs = [];
    var socket = io.connect(); 
    socket.on('msg', function (data) { 
      $scope.msgs.push(data.txt);
    })  

    //Session checker
    if (!$window.localStorage.getItem('token')) { $location.path('/login'); }
    /*-----------------------------------------------------------------------*/

    stop = $interval(function () {
      //
    }, 2000);

    $scope.logout = function () {
      $window.localStorage.removeItem('token');
      $location.path('/login');
    }

    
  }]) 