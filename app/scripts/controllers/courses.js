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
    CoursesService.get().success(function(data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = data.current_page; 
      $scope.pageSize = data.per_page;
      $scope.sort = 'id'; //data.sort;
      $scope.sortDir = 'asc';// data.sort_dir; 

      $scope.setCurrentPage = function(currentPage) {
        $scope.currentPage = currentPage+1;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

      $scope.nextPage = function(){
        if($scope.currentPage !== Math.ceil($scope.courses.total/ $scope.pageSize)){
          $scope.currentPage++;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifStyle = {'color': 'red'};
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
            $scope.notifStyle = {'color': 'red'};
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
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

      $scope.sortBy = function(sort) {
        $scope.sort = sort; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

      $scope.orderBy = function(order) {
        $scope.sortDir = order; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

    }).error(function (data) {
      $scope.notifStyle = {'color': 'red'};
      $scope.notification = data.message;
    });

      $scope.search = function(searchInput){
        CoursesService.search(searchInput).success(function(data) {
          $scope.courses = data;
          if($scope.courses.total === 0){
            console.log('nothing found');
          }
        }).error(function (data) {
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

    $scope.addFavorite = function(courseId) {
      $scope.favoritemodel = { 
          id: courseId,
          type: 'course'
        };
      FavoritesService.add($scope.favoritemodel).success(function (status) {
        if(status.status === 'Ok'){
          $scope.notifStyle = {'color': 'black'};
          $scope.notification = 'Course has been added to Your courses';
        }else{
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = status.messages.join()+'.';
        }
      }).error(function (data) {
        $scope.notifStyle = {'color': 'red'};
        $scope.notification = data.message;
      });
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
      }).error(function (data) {
        $scope.notifStyle = {'color': 'red'};
        $rootScope.notification = data.message;
      });
    };
  });