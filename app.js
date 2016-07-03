var app = angular.module('quizApp', []);
var styles;

app.directive("quizAppLogic", function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        link: function (scope) {
            scope.startQuiz = function () {
                scope.currentQuestion = 0;
                scope.myAnswers = [];
                scope.myProgress = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.getNextQuestion();
            };

            scope.getNextQuestion = function () {
                scope.myProgress += 100 / (quizFactory.questionCount() + 1);
                if (!(scope.question = quizFactory.getQuestion(scope.currentQuestion))) {
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

app.factory('quizFactory', function () {
    var questions;

    requests.getQuiz(function (response) {
        questions = response;
    });

    return {
        getQuestion: function (index) {
            if (index < questions.length) return questions[index];
            else return false;
        },
        questionCount: function () {
            return questions.length;
        }
    }
});