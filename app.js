var quizApp = angular.module('quizApp', []);
var styles;

quizApp.controller("quizController", function ($scope) {

    $scope.startQuiz = function () {
        $scope.currentQuestion = 0;
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        $scope.myAnswers = [];
        $scope.questions = [];
        requests.getQuiz(function (response) {
            $scope.questions = response;
            $scope.getNextQuestion();
        });
    };

    $scope.getNextQuestion = function () {
        $scope.$apply(function () {
            $scope.myProgress += 100 / ($scope.questions.length + 1);
            if ($scope.currentQuestion < $scope.questions.length)
                $scope.question = $scope.questions[$scope.currentQuestion];
            else {
                $scope.quizOver = true;
                requests.submitQuiz($scope.myAnswers.join(), function (response) {
                    styles = response;
                    viewStyle(0);
                });
            }
        });
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };
});