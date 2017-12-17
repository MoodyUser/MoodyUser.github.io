/**
 * Created by Yoni Mood on 5/9/2016.
 */
var myApp = angular.module('myApp', []);

myApp.controller('EsterEgg', ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {
    $scope.changeableText = {value: ""};
    $scope.contactText = {value: ""};
	$scope.immutableText = {value: ""};
    $scope.curser = {value: ""};

    var lines = [
        "AngularJS 2|4|5|?!?|||1.6",
        "HTML5",
        "CSS3... can you use flex?",
        "Sql||QL",
        "MongoDB",
        "Android",
        "Rep|sponsive Html",
        "JavaScript ES6",
        "JQuery",
        "Node.js",
        "Git",
        "BitBucket",
        "Python",
		    "Django",
		    "Full Stack"
    ];
	var current = 0;
	var writeLine = function (p, line) {
        var curser = 0;
        var textAnim = $interval(function (index) {
            if (index > line.length) {
                $interval.cancel(textAnim);
				writeLines($scope.changeableText, lines[current]);
            } else {
                if (line[curser] == "|") {
                    p.value = p.value.substring(0, p.value.length - 1)
                } else {
                    p.value += line[curser];
                }
                curser++;
            }
        }, 90);
    };

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
			writeLine($scope.contactText, "With a Practical Engineers degree i||||||||||'s degree in software development, and hands-on experience in .Net, Java, Python, JavaScript and CSS. am confident that I will be an asset to your organization as I continue to learn new languages and development techniques. as the good old");
        }, 1000);
		$timeout(function () {

        }, 19000);
    }, 1000 * 2);

}]);
