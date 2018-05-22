'use strict';

angular.module('gFood.StatsCtrl', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages'])

  .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.when('/stats', {
      templateUrl: 'views/stats/stats.html',
      controller: 'StatsCtrl',
      css: 'views/stats/stats.css'
    })
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default').primaryPalette('teal');

  }])

  .controller('StatsCtrl', ['$scope', 'GeneralService', '$interval', '$route', '$window', '$location', function ($scope, GeneralService, $interval, $route, $window, $location) {

    //Session checker
    if ($window.localStorage.getItem('token')) {
      GeneralService.getLoggedUser($window.localStorage.token.split('c412')[1]).then(function (data) {
        if (data.noExist) { $window.localStorage.removeItem('token'); return $location.path('/login'); };
        $scope.admin_id = data;
      });
    } else { $location.path('/login'); }
    if ($window.localStorage.getItem('stats')) { $scope.adminLogged = true }
    /*-----------------------------------------------------------------------*/

    $scope.admin = {};

    GeneralService.getRecords().then(function (data) {
      $scope.records = data;
      $scope.getStats(data);
    });

    $scope.loginAdminFn = function () {
      GeneralService.logginAdmin($scope.admin).then(function (data) {
        if (data.msg) { $scope.loginAdminMsg = 'Clave incorrecta'; return };
        $window.localStorage.setItem('stats', data.stats);
        $scope.adminLogged = true;
        $scope.loginAdminMsg = undefined;
      });
    }

    $scope.goTo = function () {
      $window.localStorage.removeItem('stats');
      $location.path('/');
    }

    $scope.getStats = function (data) {
      let stats = [];
      angular.forEach(data, function (user, i) {
        if (user.qualification) { stats.push(user.qualification); }; 
        if ((i + 1) === data.length) {
          let top = stats.length * 5;
          let current = stats.reduce(function (acc, val) { return acc + val; });
          $scope.score = (current / top) * 100;
          $('.stars').width(($scope.score+3)+"%");
        }
      });
    }


  }]) 