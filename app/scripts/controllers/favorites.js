'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:FavoritesCtrl
 * @description
 * # shows favorites of courses.
 */
angular.module('kakaduSpaApp').controller('FavoritesCtrl', function ($scope, $rootScope, $location, $http, $cookieStore, AuthenticationService, FavoritesService, CoursesService) {
  $scope.activeFavoriteIndex = [];
  $scope.notifInfo = 'false';
  $scope.notifDanger = 'false';
  FavoritesService.getFavorites().success(function(data) {
    $scope.favorites = data;
    if($scope.favorites.length === 0){
      $scope.notifInfo = 'true';
      $scope.notifDanger = 'false';
      $scope.notification = 'Your list is currently empty';
    }
	}).error(function (data) {
      $scope.notifInfo = 'false';
      $scope.notifDanger = 'true';
    	$scope.notification = data.message;
	});
	$scope.orderProp = 'age';

  $scope.removeFavorite = function(favoriteId) {
  	$scope.favoritemodel = { 
        id: favoriteId,
        type: 'course'
      };
    FavoritesService.remove($scope.favoritemodel).success(function (data) {
    	$scope.favorites = data;
    }).error(function (data) {
      $scope.notifInfo = 'false';
      $scope.notifDanger = 'true';
    	$scope.notification = data.message;
    });
  };

  $scope.resetPercentage = function(favoriteId) {
    CoursesService.reset(favoriteId).success(function (data) {
      $scope.favorites = data;
    }).error(function (data) {
      $scope.notifInfo = 'false';
      $scope.notifDanger = 'true';
      $scope.notification = data.message;
    });
  };

  $scope.logOut = function() {
    AuthenticationService.logout().success(function() {
      $location.path('/');
      $cookieStore.remove('databaseId');
    }).error(function (data) {
      $scope.notifInfo = 'false';
      $rootScope.notifDanger = 'true';
      $rootScope.notification = data.message;
    });
  };

  $scope.showDescription = function(index) {
    $scope.activeFavoriteIndex.push(index);
  };

  $scope.hideDescription = function(index) {
    if($scope.activeFavoriteIndex.indexOf(index) !== -1){
      $scope.activeFavoriteIndex.splice($scope.activeFavoriteIndex.indexOf(index),1);
    }
  };

  $scope.isShowing = function(index){
    //if index is in array
    if($scope.activeFavoriteIndex.indexOf(index) !== -1){
      return true;
    }
  };
});
