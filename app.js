var app = angular.module('quizApp', []);
var styles;

app.directive("quizAppLogic", function (quizFactory) {
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
                if (currentQuestion < scope.questions.length)
                    scope.question = scope.questions[currentQuestion];
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
                currentQuestion++;
                scope.getNextQuestion();
            };
        }
    };
});

app.factory('quizFactory', function() {
    var questions = [
        {
            question: "Which is the largest country in the world by population?",
            options: ["India", "USA", "China", "Russia"],
            answer: 2
        },
        {
            question: "When did the second world war end?",
            options: ["1945", "1939", "1944", "1942"],
            answer: 0
        },
        {
            question: "Which was the first country to issue paper currency?",
            options: ["USA", "France", "Italy", "China"],
            answer: 3
        },
        {
            question: "Which city hosted the 1996 Summer Olympics?",
            options: ["Atlanta", "Sydney", "Athens", "Beijing"],
            answer: 0
        },
        {
            question: "Who invented telephone?",
            options: ["Albert Einstein", "Alexander Graham Bell", "Isaac Newton", "Marie Curie"],
            answer: 1
        }
    ];

    return {
        getQuestion: function(id) {
            if(id < questions.length) {
                return questions[id];
            } else {
                return false;
            }
        }
    };
});