var quizApp = angular.module('quizApp', []);
var styles;

quizApp.controller("quizController", function ($scope) {

    var currentQuestion = 0;
    var myAnswers = [];
    var questions = [];

    $scope.startQuiz = function () {
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        requests.getQuiz(function (response) {
            questions = response;
            $scope.getNextQuestion();
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100 / (questions.length + 1);
        if (currentQuestion < questions.length)
            $scope.question = questions[currentQuestion];
        else {
            $scope.quizOver = true;
            requests.submitQuiz(myAnswers.join(), function (response) {
                styles = response;
                viewStyle(0);
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        myAnswers.push(myAnswer);
        currentQuestion++;
        $scope.getNextQuestion();
    };
});