angular.module('NodeJsMessengerBot')
.factory('LoginService', function ($http) {

    //Login
    this.login = function (data) { 
        return $http({
            url: '/api/login',
            method: 'POST',
            data: data
        }).then(function successCallback(response) {
            return response.data
        }, function errorCallback(response) {
            console.log(response); 
            return response;          
        });
    } 
 
    return this;
}); 