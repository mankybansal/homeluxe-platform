var app = angular.module('quizApp', []);
var styles;

app.directive("quizAppLogic", function() {
    return {
        restrict: 'AE',
        scope: {},
        link: function (scope, elem, attrs) {
            scope.startQuiz = function () {
                scope.currentQuestion = 0;
                scope.myAnswers = [];
                scope.questions = [];
                scope.myProgress = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                requests.getQuiz(function (response) {
                    scope.questions = response;
                    scope.getNextQuestion();
                });
            };

            scope.getNextQuestion = function () {
                scope.myProgress += 100 / (scope.questions.length + 1);
                if (scope.currentQuestion < scope.questions.length)
                    scope.question = scope.questions[scope.currentQuestion];
                    console.log(scope.question);
                else {
                    scope.quizOver = true;
                    requests.submitQuiz(scope.myAnswers.join(), function (response) {
                        styles = response;
                        viewStyle(0);
                    });
                }
            };

            scope.saveAnswer = function (myAnswer) {
                scope.myAnswers.push(myAnswer);
                scope.currentQuestion++;
                scope.getNextQuestion();
            };
        }
    };
});