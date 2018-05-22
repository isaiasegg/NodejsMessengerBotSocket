'use strict';

angular.module('gFood', [
  'ngRoute',
  'ngMaterial',
  'ngMessages',
  'angularCSS',
  'gFood.DashboardCtrl',
  'gFood.LoginCtrl',
  'gFood.StatsCtrl'
]).
  config(['$locationProvider', '$routeProvider', '$mdThemingProvider', '$provide', function ($locationProvider, $routeProvider, $mdThemingProvider, $provide) {
    $locationProvider.hashPrefix('!'); 
  }])
  .run(function ($rootScope, $location, GeneralService ) {

    GeneralService.getMeta().then(function (data) {
      $rootScope.meta = data; 
    });

  })
