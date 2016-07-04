var app = angular.module('quizApp', []);
var styles;

app.controller("quizAppController", function($scope){

    $scope.startQuiz = function(){
        $scope.currentQuestion = 0;
        $scope.myAnswers = [];
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        requests.getQuiz(function(response){
            $scope.$apply(function () {
                $scope.questions = response;
                $scope.getNextQuestion();
            });
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100 / ($scope.questions.length + 1);
        if (!($scope.question = $scope.questions[$scope.currentQuestion])) {
            $scope.quizOver = true;
            requests.submitQuiz($scope.myAnswers.join(), function (response) {
                styles = response;
                viewStyle(0);
            });
        }
    };

    $scope.saveAnswer = function (myAnswer) {
        $scope.myAnswers.push(myAnswer);
        $scope.currentQuestion++;
        $scope.getNextQuestion();
    };

});