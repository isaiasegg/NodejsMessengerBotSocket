
angular.module('myApp.DashboardCtrl', ['ngRoute', 'ngMaterial', 'angularCSS', 'ngCookies', 'platanus.rut', 'ngTableToCsv'])

  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'views/dashboard/dashboard.html',
      controller: 'DashboardCtrl',
      css: 'views/dashboard/dashboard.css'
    });
    $locationProvider.html5Mode(true);

  }])

  .controller('DashboardCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$route', '$interval', '$http', '$window', '$timeout', '$cookieStore', 'GeneralService', function ($scope, $rootScope, $routeParams, $location, $route, $interval, $http, $window, $timeout, $cookieStore, GeneralService) {

    GeneralService.getCajas().then(function (data) {
      $scope.cajas = data;
    });
 

  }])

