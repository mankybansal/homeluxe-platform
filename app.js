var app = angular.module('quizApp', []);
var styles;

app.controller("quizController",function($scope){
    $scope.start = function () {
        $scope.currentQuestion = 0;
        $scope.myProgress = 0;
        $scope.quizOver = false;
        $scope.inProgress = true;
        $scope.myAnswers = [];
        $scope.questions = [];
        requests.getQuiz(function(response){
            $scope.questions = response;
            $scope.getNextQuestion();
        });
    };

    $scope.getNextQuestion = function () {
        $scope.myProgress += 100/($scope.questions.length+1);
        $('.quizProgress').css('width', $scope.myProgress + '%');
        var q = $scope.getQuestion($scope.currentQuestion);
        if (q) {
            $scope.question = q.Questions.name;
            $scope.options = q.Options;
        } else {
            $scope.quizOver = true;
            requests.submitQuiz($scope.myAnswers.join(),function(response){
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

    $scope.getQuestion = function (id) {
        if (id < $scope.questions.length) return $scope.questions[id];
        else return false;
    }
});

//
// app.directive('quiz', function (quizFactory) {
//     return {
//         restrict: 'AE',
//         scope: {},
//         link: function (scope) {
//             scope.start = function () {
//                 scope.currentQuestion = 0;
//                 scope.myProgress = 0;
//                 scope.quizOver = false;
//                 scope.inProgress = true;
//                 scope.myAnswers = [];
//                 scope.getQuestion();
//             };
//
//             scope.getQuestion = function () {
//                 scope.myProgress += 100/(quizFactory.questionCount()+1);
//                 $('.quizProgress').css('width', scope.myProgress + '%');
//                 var q = quizFactory.getQuestion(scope.currentQuestion);
//                 if (q) {
//                     scope.question = q.Questions.name;
//                     scope.options = q.Options;
//                 } else {
//                     scope.quizOver = true;
//                     requests.submitQuiz(scope.myAnswers.join(),function(response){
//                         styles = response;
//                         viewStyle(0);
//                     });
//                 }
//             };
//
//             scope.saveAnswer = function (myAnswer) {
//                 scope.myAnswers.push(myAnswer);
//                 scope.currentQuestion++;
//                 scope.getQuestion();
//             };
//         }
//     }
// });
//
// app.factory('quizFactory', function () {
//     var questions;
//
//     requests.getQuiz(function(response){
//        questions = response;
//     });
//
//     return {
//         getQuestion: function (id) {
//             if (id < questions.length) return questions[id];
//             else return false;
//         },
//         questionCount: function(){
//             return questions.length;
//         }
//     };
// });