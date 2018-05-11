'use strict';

angular.module('gFood.DashboardCtrl', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages'])

  .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      css: 'views/dashboard/dashboard.css'
    })
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default').primaryPalette('teal');

  }])

  .controller('DashboardCtrl', ['$scope', 'GeneralService', '$interval', '$route', function ($scope, GeneralService, $interval, $route) {

    updater($scope, GeneralService);
    stop = $interval(function () {
      updater($scope, GeneralService);
    }, 2000);

    $scope.$on('$destroy', function () {
      if (angular.isDefined(stop)) { $interval.cancel(stop); stop = undefined; }
    });

    $scope.callUserFn = function (user) { 
      $scope.buttonDisabled = true;
      GeneralService.callUser(user._id, user).then(function (data) {
        $route.reload();
      });
    }

    $scope.finishUserFn = function (user) { 
      $scope.buttonDisabled = true;
      GeneralService.finishUser(user._id, user).then(function (data) {
        $route.reload();
      });
    }

    function updater(params) {
      GeneralService.getUsers().then(function (data) {
        $scope.users = data;  
      });
    }

  }]) 