/**
 * Created by Yoni Mood on 5/9/2016.
 */

var myApp = angular.module('myApp', []).factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        return exception;
    };
});

myApp.controller('formCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.form = {contain: "", title: "", from: "", to: ""};
    $http.get('data/data.json')
        .then(function (res) {
            $scope.posts = res.data;
        });

}]);

