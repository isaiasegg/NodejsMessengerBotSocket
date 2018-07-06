'use strict';

angular.module('NodeJsMessengerBot', [
  'ngRoute',
  'ngMaterial',
  'ngMessages',
  'angularCSS',
  'NodeJsMessengerBot.DashboardCtrl',
  'NodeJsMessengerBot.LoginCtrl', 
]).
  config(['$locationProvider', '$routeProvider', '$mdThemingProvider', '$provide', function ($locationProvider, $routeProvider, $mdThemingProvider, $provide) {
    $locationProvider.hashPrefix('!'); 
  }])
  .run(function () {
    
  })
