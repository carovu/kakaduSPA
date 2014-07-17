'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function($scope, courses) {
    $scope.courses = courses.data;
    $scope.orderProp = 'age';

        $scope.logout = function() {
          AuthenticationService.logout().success(function() {
          $location.path('/login');
          });
        };
  });

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # Controller for questions of chosen course
*/
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('http://localhost/kakadu/public/api/spa/course/'+$routeParams.courseId+'/learning').success(function(data) {
      $scope.question = data;

        $scope.logout = function() {
          AuthenticationService.logout().success(function() {
          $location.path('/login');
          });
        };
    });
  }]);