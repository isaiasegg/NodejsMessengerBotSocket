'use strict';

angular.module('NodeJsMessengerBot.LoginCtrl', ['ngRoute']).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {
        reloadOnSearch: false,
        templateUrl: 'views/login/login.html',
        controller: 'LoginCtrl',
        css: 'views/login/login.css'
    });

    $locationProvider.html5Mode(true);

}]).controller('LoginCtrl', ['$scope', '$rootScope', '$route', '$location', '$http', '$window', 'LoginService', 'GeneralService', '$routeParams', '$mdDialog', function ($scope, $rootScope, $route, $location, $http, $window, LoginService, GeneralService, $routeParams, $mdDialog) {
    $rootScope.loginView = true; 
    $scope.user = {};
    if ($window.localStorage.getItem('token')) { $location.path('/'); $scope.loginView = false; }
    $scope.loginFn = function () {
        LoginService.login($scope.user).then(function (data) { 
            if (data.msg) { return $scope.loginMsg = data.msg }; 
            $window.localStorage.setItem('token', 'anytoken');
            $location.path('/');
        });
    }; 
}])
