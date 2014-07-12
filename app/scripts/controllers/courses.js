'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp')
  .controller('CourseListCtrl', ['$scope', 'Course',
  function($scope, Course) {
    $scope.courses = Course.query();
    $scope.orderProp = 'age';
  }]);

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # Controller for questions of chosen course
 */

angular.module('kakaduSpaApp')
 .controller('CourseQuestionCtrl', ['$scope', '$routeParams', 'Course',
  function($scope, $routeParams, Course) {
    $scope.course = Course.get({courseId: $routeParams.courseId});
  }]);
