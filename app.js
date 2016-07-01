var app = angular.module('quizApp', []);

var styles;
app.directive('quiz', function (quizFactory) {
    return {
        restrict: 'AE',
        scope: {},
        templateUrl: 'template.html',
        link: function (scope) {
            scope.start = function () {
                scope.id = 0;
                scope.myProgress = 0;
                scope.quizOver = false;
                scope.inProgress = true;
                scope.myAnswers = [];
                scope.getQuestion();
            };

            scope.reset = function () {
                scope.inProgress = false;
            };

            scope.getQuestion = function () {
                scope.myProgress += 100/(quizFactory.questionCount()+1);
                $('.quizProgress').css('width', scope.myProgress + '%');
                var q = quizFactory.getQuestion(scope.id);
                if (q) {
                    scope.question = q.Questions.name;
                    scope.options = q.Options;
                } else {
                    console.log(scope.myAnswers);
                    scope.quizOver = true;
                    requests.submitQuiz(scope.myAnswers.join(),function(response){
                        styles = response;
                        viewStyle(0);
                    });
                }
            };

            scope.saveAnswer = function (myAnswer) {
                scope.myAnswers.push(myAnswer);
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
        },
        questionCount: function(){
            return questions.length;
        }
    };
});