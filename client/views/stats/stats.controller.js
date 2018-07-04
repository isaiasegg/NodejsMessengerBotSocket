'use strict';

angular.module('gFood.StatsCtrl', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ngMaterial', 'ngMessages'])

  .config(['$routeProvider', '$locationProvider', '$mdThemingProvider', function ($routeProvider, $locationProvider, $mdThemingProvider) {
    $routeProvider.when('/admin', {
      templateUrl: 'views/stats/stats.html',
      controller: 'StatsCtrl',
      css: 'views/stats/stats.css'
    })
    $locationProvider.html5Mode(true);
    $mdThemingProvider.theme('default').primaryPalette('teal');

  }])

  .controller('StatsCtrl', ['$scope', 'GeneralService', '$timeout', '$route', '$window', '$location', function ($scope, GeneralService, $timeout, $route, $window, $location) {

    //Session checker
    if ($window.localStorage.getItem('token')) {
      GeneralService.getLoggedUser($window.localStorage.token.split('c412')[1]).then(function (data) {
        if (data.noExist) { $window.localStorage.removeItem('token'); return $location.path('/login'); };
        $scope.admin = data;
        $scope.adminpass = data.password;  
        $scope.adminModel = $scope.admin;
        $scope.adminModel.password = '';
      });
    } else { $location.path('/login'); }
    if ($window.localStorage.getItem('stats')) { $scope.adminLogged = true }
    /*-----------------------------------------------------------------------*/

    $scope.admin = {};

    GeneralService.getRecords().then(function (data) {
      $scope.records = data;
      $scope.sales = data;
      $scope.daySells = $scope.daySellsFn(data);
      $scope.getStats(data);
    });

    $scope.loginAdminFn = function () {
      GeneralService.logginAdmin($scope.admin).then(function (data) {
        if (data.msg) { $scope.loginAdminMsg = 'Clave incorrecta'; return };
        $window.localStorage.setItem('stats', data.stats);
        $scope.adminLogged = true;
        $scope.loginAdminMsg = undefined;
        //
        GeneralService.getRecords().then(function (data) {
          $scope.getStats(data);
        });
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
          $('.stars').width(($scope.score + 3) + "%");
        }
      });
    }

    $scope.saveEmailFn = function (id) {
      GeneralService.saveEmail(id, $scope.adminModel).then(function (data) {
        $scope.adminModel.email = data.email;
        $scope.emailSaved = true;
        $timeout(function () {
          $scope.emailSaved = false;
        }, 10000)
      });
    };

    $scope.saveAdminPassFn = function (id) {
      GeneralService.saveAdminPass(id, $scope.adminModel).then(function (data) {
        $scope.adminModel.adminPass = data.adminPass;
        $scope.adminPassSaved = true;
        $timeout(function () {
          $scope.adminPassSaved = false;
        }, 10000)
      });
    };

    $scope.logOut = function () {
      GeneralService.logOut().then(function (data) { });
    }

    $scope.turnOffFn = function () {
      GeneralService.turnOff().then(function (data) { });
    } 

    $scope.changePassFn = function (id) {
      if ($scope.adminModel.password === $scope.adminpass) {
        if ($scope.adminModel.newPassword === $scope.adminModel.repPassword) { 

          GeneralService.changePass(id, $scope.adminModel).then(function (data) {
            $scope.adminpass = data.password;
            $scope.msgErr = undefined;
            $scope.adminModel.password = '';
            $scope.adminModel.newPassword = '';
            $scope.adminModel.repPassword = '';
            $scope.passChanged = 'Contraseña de cuenta cambiada con exito';
            $timeout(function () { $scope.passChanged = undefined; }, 10000);
          });

        } else {
          $scope.msgErr = 'Las contraseñas no coinciden';
          $timeout(function () { $scope.msgErr = undefined; }, 10000)
        }
      } else {
        $scope.msgErr = 'Contraseña actual incorrecta';
        $timeout(function () { $scope.msgErr = undefined; }, 10000)
      }
    }

    $scope.getAttentionTime = function (user) {
      var diffMs = new Date(user.called_time) - (new Date(user.registered_time)); // milliseconds between now & Christmas
      var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
      return diffMins
    }

    $scope.filters = {};
    $scope.filterByDate = function (sales) {
      $scope.sales = sales.filter(r => new Date(r.registered_time).toDateString() == new Date($scope.filters.date).toDateString());
    }

    $scope.clearFilterByDate = function () {
      $scope.sales = $scope.records;
      $scope.filters.date = undefined;
    }

    $scope.daySellsFn = function (sales) {
      return sales.filter(r => new Date(r.registered_time).toDateString() == new Date().toDateString()).length;
    }


  }]) 