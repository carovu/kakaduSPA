'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function($scope, $location, $route, $http, AuthenticationService, CoursesService) {
    CoursesService.get().success(function(data) {
      $scope.courses = data;
    });
    $scope.orderProp = 'age';

    $scope.resetPercentage = function(courseId) {
      CoursesService.reset(courseId).success(function() {
        $route.reload();
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };

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

    
