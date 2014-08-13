'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function ($scope, $rootScope, $location, $route, $http, $cookieStore, AuthenticationService, CoursesService, FavoritesService) {
    $scope.orderProp = 'age';
    $scope.descript = 'false';
    $scope.activeCourseIndex = undefined;
    $scope.userId = $cookieStore.get('databaseId');
    CoursesService.get().success(function(data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = data.current_page; 
      $scope.pageSize = data.per_page;      

      $scope.setCurrentPage = function(currentPage) {
        $scope.currentPage = currentPage+1;
        CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
          $scope.courses = data;
        }).error(function (data) {
          $scope.notifStyle = {'color': 'red'};
          $scope.notification = data.message;
        });
      };

      $scope.nextPage = function(){
        if($scope.currentPage !== Math.ceil($scope.courses.total/ $scope.pageSize)){
          $scope.currentPage++;
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
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
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifStyle = {'color': 'red'};
            $scope.notification = data.message;
          });
        }
      };

      $scope.firstPage = function(){
        if($scope.currentPage !== 1){
          $scope.currentPage = 1;
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
            $scope.courses = data;
          }).error(function (data) {
            $scope.notifStyle = {'color': 'red'};
            $scope.notification = data.message;
          });
        }
      };

      $scope.lastPage = function(){
        if($scope.currentPage !== Math.ceil($scope.courses.total/ $scope.pageSize)){
          $scope.currentPage = Math.ceil($scope.courses.total/ $scope.pageSize);
          CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
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

      $scope.changePageSize = function() {
        $scope.pageSize += 25; 
        CoursesService.getPage($scope.currentPage, $scope.pageSize).success(function(data) {
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
      $scope.activeCourseIndex = index;
    };

    $scope.hideDescription = function(index) {
      if($scope.activeCourseIndex === index){
        $scope.activeCourseIndex = undefined;
      }
    };

    $scope.isShowing = function(index){
      return  $scope.activeCourseIndex === index;
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