var app = angular.module('quizApp', []);
var myAnswers;

app.directive('quiz', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template.html',
        link: function (scope, element, attributes) {
            scope.start = function () {
                scope.id = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getQuestion();
            };

            scope.reset = function () {
                scope.inProgress = false;
            };

            scope.getQuestion = function () {
                var q = quizFactory.getQuestion(scope.id);
                if (q) {
                    scope.question = q.Questions.name;
                    scope.options = q.Options;
                } else {
                    console.log(myAnswers);
                    scope.quizOver = true;
                }
            };

            scope.saveAnswer = function (param) {
                console.log(param);
                scope.nextQuestion();
            };

            scope.nextQuestion = function () {
                scope.id++;
                scope.getQuestion();
            };

            scope.reset();
        }
    }
});

app.factory('quizFactory', function () {
    var questions = [
        {
            Options: [
                {
                    id: 34,
                    image: "Q104.jpg",
                    name: "Wellness1"
                },
                {
                    id: 35,
                    image: "Q104.jpg",
                    name: "Wellness2"
                },
                {
                    id: 36,
                    image: "Q104.jpg",
                    name: "Wellness3"
                },
                {
                    id: 37,
                    image: "Q104.jpg",
                    name: "Wellness4"
                }
            ],
            Questions: {
                id: 30,
                name: "Your perfect holiday.",
                order: 1
            }
        },
        {
            Options: [
                {
                    id: 38,
                    image: "Q104.jpg",
                    name: "Wellness5"
                },
                {
                    id: 39,
                    image: "Q104.jpg",
                    name: "Wellness6"
                },
                {
                    id: 40,
                    image: "Q104.jpg",
                    name: "Wellness7"
                },
                {
                    id: 41,
                    image: "Q104.jpg",
                    name: "Wellness8"
                }
            ],
            Questions: {
                id: 31,
                name: "Your perfect holiday1.",
                order: 2
            }
        }
    ];

    return {
        getQuestion: function (id) {
            if (id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
});