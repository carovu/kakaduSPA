'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function ($scope, $rootScope, $location, $http, $cookieStore, AuthenticationService, CoursesService, FavoritesService) {
    $scope.orderProp = 'age';
    $scope.descript = 'false';
    $scope.activeCourseIndex = [];
    $scope.userId = $cookieStore.get('databaseId');
    $scope.notifSuccess = 'false';
    $scope.notifDanger = 'false';
    
    CoursesService.get().success(function(data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = 1; 
      $scope.pageSize = 20;
      $scope.sort = 'id'; //data.sort;
      $scope.sortDir = 'asc';// data.sort_dir; 

      $scope.setCurrentPage = function(currentPage) {
        $scope.currentPage = currentPage+1;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        });
      };

      $scope.nextPage = function(){
        if($scope.currentPage !== Math.ceil($scope.courses.total/ $scope.pageSize)){
          $scope.currentPage++;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          });
        }
        
      };

      $scope.previousPage = function(){
        if($scope.currentPage !== 1){
          $scope.currentPage--;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          });
        }
      };

      $scope.getNumberAsArray = function (num) {
        return new Array(num);
      };

      $scope.numberOfPages = function() {
        return Math.ceil($scope.courses.total/ $scope.pageSize);
      };

      $scope.changePageSize = function(size) {
        $scope.pageSize = size; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        });
      };

      $scope.sortBy = function(sort) {
        $scope.sort = sort; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        });
      };

      $scope.orderBy = function(order) {
        $scope.sortDir = order; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        });
      };

    }).error(function (data) {
      $scope.notifSuccess = 'false';
      $scope.notifDanger = 'true';
      $scope.notification = data.message;
    });

    $scope.search = function(searchInput){
      CoursesService.search(searchInput).success(function(data) {
        $scope.courses = data;
        if($scope.courses.total === 0){
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = 'The course does not exist.';
        }
      }).error(function (data) {
        $scope.notifSuccess = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
      });
    };

    $scope.addFavorite = function(courseId, isFavorite) {
      $scope.favoritemodel = { 
          id: courseId,
          type: 'course'
        };
        if(isFavorite === true){
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = 'Course has already been added to Your courses list.';
        } else{
          FavoritesService.add($scope.favoritemodel).success(function (data) {
            $scope.notifSuccess = 'true';
            $scope.notifDanger = 'false';
            $scope.notification = 'Course has been added to Your courses';
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          });
        }
      
    };

    $scope.showDescription = function(index) {
      $scope.activeCourseIndex.push(index);
    };

    $scope.hideDescription = function(index) {
      if($scope.activeCourseIndex.indexOf(index) !== -1){
        $scope.activeCourseIndex.splice($scope.activeCourseIndex.indexOf(index),1);
      }
    };

    $scope.isShowing = function(index){
      //if index is in array
      if($scope.activeCourseIndex.indexOf(index) !== -1){
        return true;
      }
    };

    $scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        $rootScope.notifDanger = 'true';
        $rootScope.notification = data.message;
      });
    };
  });