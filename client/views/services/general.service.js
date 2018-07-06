angular.module('NodeJsMessengerBot').factory('GeneralService', function ($q) {

    this.getMsg = function () {
        var deferred = $q.defer();
        var socket = io.connect();  
        deferred.resolve({
            on: function (eventName, callback) {
                socket.on(eventName, callback);
            },
            emit: function (eventName, data) {
                socket.emit(eventName, data);
            }
        });
        return deferred.promise;
    }

    return this;
});