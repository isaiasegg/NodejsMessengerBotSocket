'user strict'; 
angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'angularCSS',
  'myApp.DashboardCtrl', 

]).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
}]).run(function ($rootScope, $window, $location, $route, GeneralService) {
  
});
