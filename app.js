var app = angular.module('quizApp', []);
var styles;

app.controller("quizController", function ($scope) {

    $scope.start = function () {
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
        $scope.myProgress += 100 / ($scope.questions.length + 1);
        $('.quizProgress').css('width', $scope.myProgress + '%');
        if ($scope.currentQuestion < $scope.questions.length) {
            $scope.question = $scope.questions[$scope.currentQuestion].Questions.name;
            $scope.options = $scope.questions[$scope.currentQuestion].Options;
            console.log(q);
        } else {
            $scope.quizOver = true;
            requests.submitQuiz($scope.myAnswers.join(), function (response) {
                styles = response;
                viewStyle(0);
            });
        }
        $scope.$apply();
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };
});