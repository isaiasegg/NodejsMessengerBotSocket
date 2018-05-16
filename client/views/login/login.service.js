angular.module('gFood')
.factory('LoginService', function ($http, $q,$window,$location) {

    //GET USER
    this.login = function (data) { 
        return $http({
            url: '/asdcac1546k4ds684f46vx65dh46j/login',
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