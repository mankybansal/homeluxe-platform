var app = angular.module('quizApp', []);
var styles;


app.directive('quiz', function () {
    return {
        scope: {},
        link: function (scope) {
            scope.start = function () {
                scope.questions = {};
                scope.currentQuestion = 0;
                scope.myProgress = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.myAnswers = [];
                requests.getQuiz(function (response) {
                    scope.questions = response;
                    scope.getQuestion();
                });
            };

            scope.getQuestion = function () {
                scope.myProgress += 100 / (scope.questions.length + 1);
                $('.quizProgress').css('width', scope.myProgress + '%');
                if (scope.currentQuestion < scope.questions.length) {
                    scope.question = scope.questions[scope.currentQuestion].Questions;
                    scope.options = scope.questions[scope.currentQuestion].Options;
                } else {
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
                scope.getQuestion();
            };
        }
    }
});