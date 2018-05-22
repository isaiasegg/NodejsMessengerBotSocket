angular.module('gFood').factory('GeneralService', function ($http, $q, $window, $location) {
    this.getUsers = function (id) {
        return $http({
            url: '/api/users',
            method: 'GET'
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.getRecords = function (id) {
        return $http({
            url: '/api/records',
            method: 'GET'
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.logginAdmin = function (data) {
        return $http({
            url: '/api/adminlogin',
            method: 'POST',
            data: data
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.callUser = function (id, data) {
        return $http({
            url: '/api/usercalled/' + id,
            method: 'PUT',
            data
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.finishUser = function (id, data) {
        return $http({
            url: '/api/userfinished/' + id,
            method: 'PUT',
            data
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.getMeta = function (id) {
        return $http({
            url: '/api/meta',
            method: 'GET'
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    this.getLoggedUser = function (id) {
        return $http({
            url: '/api/loggeduser/' + id,
            method: 'GET'
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response);
            return response;
        });
    }

    return this;
});