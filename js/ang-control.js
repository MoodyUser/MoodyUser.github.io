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
    $scope.relevantPosts = [];
    $http.get('data/data.json')
        .then(function (res) {
            $scope.posts = res.data;
            $scope.search();
        });

    $scope.search = function () {
        var whereStr = [];
        var relevant = Enumerable.From($scope.posts);
        if ($scope.form.title != "") {
            whereStr.push("$.title.toLowerCase().includes('" + $scope.form.title.toLowerCase() + "') ");
        }
        if ($scope.form.contain != "") {
            whereStr.push(" $.text.toLowerCase().includes('" + $scope.form.contain.toLowerCase() + "')");
        }
        if ($scope.form.from != "") {
            whereStr.push(" new Date($.time) >  new Date('" +$scope.form.from + "')");
        }
        if ($scope.form.to != "") {
            whereStr.push(" new Date($.time) <  new Date('" +$scope.form.to + "')");
        }

        if (whereStr.length!=0) {
            relevant = relevant.Where(whereStr.join(" && "));
        }
        //.OrderBy("$.user.screen_name")
        $scope.relevantPosts = relevant.ToArray();
        $scope.$apply();
    };
}]);

