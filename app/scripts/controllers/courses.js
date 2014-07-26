'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function($scope, $location, AuthenticationService, CoursesService) {
    CoursesService.get().success(function(data) {
      $scope.courses = data;
    });

    $scope.orderProp = 'age';

    $scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };
  });

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # Controller for questions of chosen course
*/
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', function($scope, $routeParams, $http, $location, AuthenticationService) {
    $http.get('http://localhost/kakadu/public/api/spa/course/'+$routeParams.courseId+'/learning').success(function(data) {
      $scope.question = data;
      $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
      $scope.showSimpleAnswer = 'false';
      $scope.simpleAnswered = 'false'; //hide button after checking answer

      $scope.nextQuestion = function() {
        //course bleibt immer gleich, quesiton und catalog id ändert sich, 
        //answer ist, ob der user die question richtig oder falsch beantwortet hat
        $scope.questionmodel = { 
          question: $scope.question.id, 
          course: $scope.question.course, 
          catalog: $scope.question.catalog,  
          section: 'course', //in laravelclient is choice between learning from catalogsection or favoritesection and is given over view, backbone and javascript 
                             //-> since we only have a course section in this client, and no backbone or view to give over and then call from in postadd, 
                             //we will add it manually here
          answer: 'false'
        };
        $http.post('http://localhost/kakadu/public/api/spa/learning/next', $scope.questionmodel).success(function(data) {
          $scope.question = data;
          //dont forget to copy initializing here too
          $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
          $scope.showSimpleAnswer = 'false';
          $scope.simpleAnswered = 'false'; //hide button after checking answer
          console.log(data);
        }).error(function (data, config) {
          $location.path('/');
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };

      $scope.logOut = function() {
        AuthenticationService.logout().success(function() {
        }).error(function (data, config) {
          $location.path('/course/'+$routeParams.courseId+'/learning');
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };

      //functions to display the different questions

      //functions for simplequestions

      //show simple answer
      $scope.showSimple = function() {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true'; //show correct, wrong button in simple
      };

      //use did remember answer correctly 
      $scope.simpleAnswerCorrect = function() {
        $scope.checkAnswer = 'true';
        $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
      };
      
      //user did not remember answer correctly
      $scope.simpleAnswerWrong = function() {
        $scope.checkAnswer = 'false';
        $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
      };
    }).error(function (data, config) {
      $location.path('/');
      console.log('Have you logged in?');
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });
});
    
