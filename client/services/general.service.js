angular.module('myApp')

    .factory('GeneralService', function ($http, $q) {

        this.login = function (data) {
            return $http({
                url: '/api/login',
                method: 'POST',
                data: data
            }).then(function successCallback(response) {
                return response.data
            }, function errorCallback(response) { 
                return response;
            });
        }
        
        this.getRecords = function () {
            return $http({
                url: '/api/records',
                method: 'GET'
            }).then(function successCallback(response) {
                return response.data
            }, function errorCallback(response) { 
                return response;
            });
        }

        this.getUsers = function () {
            return $http({
                url: '/api/users',
                method: 'GET'
            }).then(function successCallback(response) {
                return response.data
            }, function errorCallback(response) { 
                return response;
            });
        }

        return this;
    });