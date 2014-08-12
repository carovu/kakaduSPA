'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function ($scope, $rootScope, $location, $route, $http, $cookieStore, AuthenticationService, CoursesService, FavoritesService) {
    $scope.orderProp = 'age';
    $scope.userId = $cookieStore.get('databaseId');
    console.log($scope.userId);
    CoursesService.get().success(function(data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = 1; 
      $scope.pageSize = 25;      

      $scope.setCurrentPage = function(currentPage) {
          $scope.currentPage = currentPage+1;
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notification = data.message;
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
          }).error(function (data) {
            $scope.notification = data.message;
          });
      };
    }).error(function (data) {
      $scope.notification = data.message;
    });

      $scope.search = function(searchInput){
        CoursesService.search(searchInput).success(function(data) {
          $scope.courses = data;
          if($scope.courses.total === 0){
            console.log('nothing found');
          }
        }).error(function (data) {
          $scope.notification = data.message;
        });
      };

    $scope.addFavorite = function(courseId) {
      $scope.favoritemodel = { 
          id: courseId,
          type: 'course'
        };
      FavoritesService.add($scope.favoritemodel).success(function() {
      }).error(function (data) {
        $scope.notification = data.message;
      });
    };

    $scope.resetPercentage = function(courseId) {
      CoursesService.reset(courseId).success(function() {
        $route.reload();
      }).error(function (data) {
        $scope.notification = data.message;
      });
    };

    $scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
      }).error(function (data) {
        $rootScope.notification = data.message;
      });
    };
  });