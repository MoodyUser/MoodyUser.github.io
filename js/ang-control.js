/**
 * Created by Yoni Mood on 5/9/2016.
 */
var myApp = angular.module('myApp', []).factory('$exceptionHandler', function () {
    return function (exception, cause) {
        exception.message += ' (caused by "' + cause + '")';
        return exception;
    };
});

myApp.directive('well', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link: function postLink(scope, iElement, iAttrs) {
            jQuery(document).on('keypress', function (e) {
                scope.$apply(scope.keyPressed(e));
            });
        }
    };
});


myApp.directive('test', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link: function postLink(scope, iElement, iAttrs) {
            scope.$apply(scope.basicTest());
        }
    };
});


myApp.controller('formCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.form = {text: "", title: "", from: "", to: "", orderby: "time", reverse: true};
    $scope.relevantPosts = [];
    $http.get('data/data.json')
        .then(function (res) {
            $scope.posts = res.data;
            $scope.searchApply();
        });

    $scope.searchApply = function () {
        $scope.search();
        $scope.$apply();
    };

    $scope.search = function () {
        var whereStr = [];
        var relevant = Enumerable.From($scope.posts);
        if ($scope.form.title != "") {
            whereStr.push("$.title.toLowerCase().includes('" + $scope.form.title.toLowerCase() + "') ");
        }
        if ($scope.form.text != "") {
            whereStr.push(" $.text.toLowerCase().includes('" + $scope.form.text.toLowerCase() + "')");
        }
        if ($scope.form.from != "") {
            whereStr.push(" new Date($.time) >  new Date('" + $scope.form.from + "')");
        }
        if ($scope.form.to != "") {
            whereStr.push(" new Date($.time) <  new Date('" + $scope.form.to + "')");
        }
        if (whereStr.length != 0) {
            relevant = relevant.Where(whereStr.join(" && "));
            //.OrderBy("$."+$scope.form.orderby+"");
        }
        $scope.relevantPosts = relevant.Select(function (x) {
            x.readMore = true;
            x.time = new Date(x.time).toUTCString();
            return x;
        }).ToArray();
    };

    $scope.orderBy = function (predicate) {
        $scope.form.orderby = predicate;
        $scope.form.reverse = !$scope.form.reverse;
    };

    $scope.keyPressed = function (e) {
        console.log(e.which == 96);
        if (e.which == 96) {
            console.log(e.which);
        }
    };

    $scope.basicTest = function () {
        $http.get('data/data_test.json')
            .then(function (res) {
                var data = $scope.posts;
                $scope.posts = res.data;

                console.log("posts received: " + ($scope.posts.length == 1));
                $scope.search();

                console.log("relevantPosts is equal to posts: " + ($scope.posts.length == $scope.relevantPosts.length));
                $scope.form.title = "checking title..";
                $scope.search();
                console.log("checking if nav.title works: " + (0 == $scope.relevantPosts.length));

                $scope.form.title = "";
                $scope.form.from = "11/11/2014 12:00 AM";
                $scope.search();
                console.log("checking if nav.from works: " + (1 == $scope.relevantPosts.length));

                $scope.form.from = "";
                $scope.form.to = "11/11/2017 12:00 AM";
                $scope.search();
                console.log("checking if nav.to works:" + (1 == $scope.relevantPosts.length));

                $scope.form.to = "";
                $scope.form.text = "not working....";
                $scope.search();
                console.log("checking if nav.text works:" + (0 == $scope.relevantPosts.length));
                $scope.form.text = "";
                console.log("");
                console.log("basicTest ended..");

                $scope.posts = data;
                $scope.search();
                $scope.$apply();
            });
    };

}])
;


