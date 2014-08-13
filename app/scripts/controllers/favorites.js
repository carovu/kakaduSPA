'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:FavoritesCtrl
 * @description
 * # shows favorites of courses.
 */
angular.module('kakaduSpaApp').controller('FavoritesCtrl', function ($scope, $rootScope, $location, $route, $http, AuthenticationService, FavoritesService, CoursesService) {
  $scope.activeFavoriteIndex = undefined;
  FavoritesService.getFavorites().success(function(data) {
    $scope.favorites = data;
    //if there are no favorites, jump to all courses
    if($scope.favorites.length === 0){
      $location.path('/courses');
    }
	}).error(function (data) {
    	$scope.notification = data.message;
	});
	$scope.orderProp = 'age';

  $scope.removeFavorite = function(favoriteId) {
  	$scope.favoritemodel = { 
        id: favoriteId,
        type: 'course'
      };
    FavoritesService.remove($scope.favoritemodel).success(function() {
    		$route.reload();
    }).error(function (data) {
    	$scope.notification = data.message;
    });
  };

  $scope.resetPercentage = function(favoriteId) {
    CoursesService.reset(favoriteId).success(function() {
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

  $scope.showDescription = function(index) {
    $scope.activeFavoriteIndex = index;
  };

  $scope.hideDescription = function(index) {
    if($scope.activeFavoriteIndex === index){
      $scope.activeFavoriteIndex = undefined;
    }
  };

  $scope.isShowing = function(index){
    return  $scope.activeFavoriteIndex === index;
  };
});
