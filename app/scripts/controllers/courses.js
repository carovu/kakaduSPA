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
      $scope.sort = 'name'; //data.sort;
      $scope.sortDir = 'asc';// data.sort_dir; 

      $scope.setCurrentPage = function(currentPage) {
        resetCoursesNotif();
        $scope.currentPage = currentPage+1;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          if(angular.isString(data.message)){
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          }else{
            $location.path('/500');
          }
        });
      };

      $scope.nextPage = function(){
        resetCoursesNotif();
        if($scope.currentPage !== Math.ceil($scope.courses.total/ $scope.pageSize)){
          $scope.currentPage++;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            if(angular.isString(data.message)){
              $scope.notifSuccess = 'false';
              $scope.notifDanger = 'true';
              $scope.notification = data.message;
            }else{
              $location.path('/500');
            }
          });
        }
        
      };

      $scope.previousPage = function(){
        resetCoursesNotif();
        if($scope.currentPage !== 1){
          $scope.currentPage--;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            if(angular.isString(data.message)){
              $scope.notifSuccess = 'false';
              $scope.notifDanger = 'true';
              $scope.notification = data.message;
            }else{
              $location.path('/500');
            }
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
        resetCoursesNotif();
        $scope.pageSize = size; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          if(angular.isString(data.message)){
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          }else{
            $location.path('/500');
          }
        });
      };

      $scope.sortBy = function(sort) {
        resetCoursesNotif();
        $scope.sort = sort; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          if(angular.isString(data.message)){
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          }else{
            $location.path('/500');
          }
        });
      };

      $scope.orderBy = function(order) {
        resetCoursesNotif();
        $scope.sortDir = order; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          if(angular.isString(data.message)){
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          }else{
            $location.path('/500');
          }
        });
      };

    }).error(function (data) {
      if(angular.isString(data.message)){
        $scope.notifSuccess = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
      }else{
        $location.path('/500');
      }
    });

    $scope.search = function(searchInput){
      resetCoursesNotif();
      CoursesService.search(searchInput).success(function(data) {
        $scope.courses = data;
        if($scope.courses.total === 0){
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = 'The course does not exist.';
        }
      }).error(function (data) {
        if(angular.isString(data.message)){
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        }else{
        $location.path('/500');
      }
      });
    };

    $scope.addFavorite = function(courseId) {
      resetCoursesNotif();
      $scope.favoritemodel = { 
          id: courseId,
          type: 'course'
        };
        FavoritesService.add($scope.favoritemodel).success(function (data) {
          $scope.notifSuccess = 'true';
          $scope.notifDanger = 'false';
          $scope.notification = 'Course has been added to Your courses';
          $scope.courses = data;
        }).error(function (data) {
          if(angular.isString(data.message)){
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          }else{
            $location.path('/500');
          }
        });
        
      
    };

    $scope.showDescription = function(index) {
      resetCoursesNotif();
      $scope.activeCourseIndex.push(index);
    };

    $scope.hideDescription = function(index) {
      resetCoursesNotif();
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
      resetCoursesNotif();
      AuthenticationService.logout().success(function() {
        $location.path('/');
        $cookieStore.remove('displayname');
        $cookieStore.remove('email');
        $cookieStore.remove('language');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        if(angular.isString(data.message)){
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        }else{
          $location.path('/500');
        }  
      });
    };

    function resetCoursesNotif() {
      $scope.notifSuccess = 'false';
      $scope.notifDanger = 'false';
      $scope.notification = undefined;     
    }
  });