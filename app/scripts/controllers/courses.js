'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function ($scope, $location, $route, $http, AuthenticationService, CoursesService, FavoritesService) {
    $scope.orderProp = 'age';
    CoursesService.get().success(function(data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = 1; 
      $scope.pageSize = 25;      

      $scope.setCurrentPage = function(currentPage) {
          $scope.currentPage = currentPage+1;
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
            $scope.courses = data;
          }).error(function (data, config) {
            console.log('error data:');
            console.log(data);
            console.log('error config:');
            console.log(config);
          });
      };

      $scope.getNumberAsArray = function (num) {
          return new Array(num);
      };

      $scope.numberOfPages = function() {
          return Math.ceil($scope.courses.total/ $scope.courses.per_page);
      };

      $scope.changePageSize = function() {
          $scope.pageSize += 25; 
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
            $scope.courses = data;
          }).error(function (data, config) {
            console.log('error data:');
            console.log(data);
            console.log('error config:');
            console.log(config);
          });
      };
    }).error(function (data, config) {
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });

      $scope.search = function(searchInput){
        CoursesService.search(searchInput).success(function(data) {
          $scope.courses = data;
          if($scope.courses.total === 0){
            console.log('nothing found');
          }
        }).error(function (data, config) {
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };

    $scope.addFavorite = function(courseId) {
      $scope.favoritemodel = { 
          id: courseId,
          type: 'course'
        };
        FavoritesService.add($scope.favoritemodel).success(function() {
          
      }).error(function (data, config) {
        console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
      });
    };

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