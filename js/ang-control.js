/**
 * Created by Yoni Mood on 5/9/2016.
 */
var myApp = angular.module('myApp', ['ngSanitize']).factory('$exceptionHandler', function () {
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

myApp.directive('toggle', function () {
    return {
        restrict: 'E',
        replace: true,
        link: function (scope, element, attrs) {
            element.bind('click', function (event) {
                element.toggleClass('cell-disappear-on');
            });
        }
    };
});

myApp.controller('formCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.form = {both: "", text: "", title: "", from: "", to: "", orderby: "time", reverse: true};
    $scope.relevantPosts = [];

    $.ajax({
        type: "POST",
        url: "http://moodpics.bugs3.com/getData.php",
        data: {pass: "myPass"},
        dataType: 'json',
        success: function (res) {
            $scope.posts = res;
            $scope.searchApply();
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        },
        dataType: "json"
    });

    $scope.searchApply = function () {
        $scope.search();
        $scope.$apply();
    };

    $scope.search = function () {
        var andor = " && ";
        var whereStr = [];
        if ($scope.form.both != "") {
            whereStr.push("$.title.toLowerCase().includes('" + $scope.form.both.toLowerCase() + "') ||" +
                " $.text.toLowerCase().includes('" + $scope.form.both.toLowerCase() + "')");
        }
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
            relevant = relevant.Where(whereStr.join(andor));
            //.OrderBy("$."+$scope.form.orderby+"");
        }
        $scope.relevantPosts = relevant.Select(function (x) {
            x.readMore = true;
            x.timestamp = (new Date(parseFloat(x.timestamp))).toTimeString();
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

}]);

myApp.controller('EsterEgg', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {
    $scope.changeableText = {value: ""};
    $scope.immutableText = {value: ""};
    $scope.curser = {value: ""};

    var lines = [
        "Sql||QL",
        "MongoDB",
        "Android",
        "Rep|sponsive Html",
        "JavaScript",
        "Angyk||ularJS",
        "Node.js",
        "Css",
        "Git",
        "BitBucket",
        "Python",
        "Full Stack"
    ];
    var current = 0;
    var writeLines = function (p, line) {
        var curser = 0;
        var textAnim = $interval(function (index) {
            if (index > line.length) {
                $interval.cancel(textAnim);
                $timeout(function () {
                    deleteLine(p);
                }, 3000);
            } else {
                if (line[curser] == "|") {
                    p.value = p.value.substring(0, p.value.length - 1)
                } else {
                    p.value += line[curser];
                }
                curser++;
            }
        }, 200);
    };
    var deleteLine = function (p) {
        var textAnim = $interval(function (index) {
            if (p.value.length <= 0) {
                $interval.cancel(textAnim);
                if ((current + 1) < lines.length) {
                    current++;
                } else {
                    current = 0;
                }
                writeLines($scope.changeableText, lines[current]);
            } else {
                p.value = p.value.substring(0, p.value.length - 1)
            }
        }, 80);
    };
    $timeout(function () {
        $scope.immutableText.value = "yoni@mood:~$ ";
        $scope.curser.value = "<b>|</b>";
        $timeout(function () {
            writeLines($scope.changeableText, lines[current])
        }, 1000);
    }, 1000 * 2);

}]);

myApp.filter('highlight', function ($sce) {
    return function (text, phrase) {
        if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
            '<span class="highlighted">$1</span>');

        return $sce.trustAsHtml(text)
    }
});
