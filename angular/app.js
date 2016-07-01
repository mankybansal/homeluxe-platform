var app = angular.module('quizApp', []);
var myAnswers;

var myProgress = 0;

app.directive('quiz', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template.html',
        link: function (scope) {
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
                myProgress += 14.28;
                $('.quizProgress').css('width', myProgress + '%');
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
    var questions;

    requests.getQuiz(function(response){
       questions = response;
    });

    return {
        getQuestion: function (id) {
            if (id < questions.length) return questions[id];
            else return false;
        }
    };
});