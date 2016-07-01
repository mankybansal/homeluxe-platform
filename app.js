var app = angular.module('quizApp', []);
var styles;
app.directive('quiz', function (quizFactory) {
    return {
        scope: {},
        link: function (scope) {
            scope.start = function () {
                scope.currentQuestion = 0;
                scope.myProgress = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.myAnswers = [];
                scope.getQuestion();
            };

            scope.getQuestion = function () {
                scope.myProgress += 100 / (quizFactory.questionCount() + 1);
                $('.quizProgress').css('width', scope.myProgress + '%');
                if (quizFactory.getQuestion(scope.currentQuestion)) {
                    scope.question = q.Questions.name;
                    scope.options = q.Options;
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

app.factory('quizFactory', function () {
    var questions;

    requests.getQuiz(function (response) {
        questions = response;
    });

    return {
        getQuestion: function (id) {
            if (id < questions.length) return questions[id];
            else return false;
        },
        questionCount: function () {
            return questions.length;
        }
    };
});