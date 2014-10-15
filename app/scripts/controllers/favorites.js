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
      if(angular.isString(data.message)){
        $scope.notifInfo = 'false';
        $scope.notifDanger = 'true';
      	$scope.notification = data.message;
      }else{
        $location.path('/500');
      }
	});
	$scope.orderProp = 'age';

  $scope.removeFavorite = function(favoriteId) {
  	resetFavoritesNotif();
    $scope.favoritemodel = { 
        id: favoriteId,
        type: 'course'
      };
    FavoritesService.remove($scope.favoritemodel).success(function (data) {
    	$scope.favorites = data;
      if($scope.favorites.length === 0){
        $scope.notifInfo = 'true';
        $scope.notifDanger = 'false';
        $scope.notification = 'Your list is currently empty';
      }
    }).error(function (data) {
      if(angular.isString(data.message)){
        $scope.notifInfo = 'false';
        $scope.notifDanger = 'true';
      	$scope.notification = data.message;
      }else{
        $location.path('/500');
      }
    });
  };

  $scope.resetPercentage = function(favoriteId) {
    resetFavoritesNotif();
    CoursesService.reset(favoriteId).success(function (data) {
      $scope.favorites = data;
    }).error(function (data) {
      if(angular.isString(data.message)){
        $scope.notifInfo = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
      }else{
        $location.path('/500');
      }
    });
  };
  
  $scope.showDescription = function(index) {
    resetFavoritesNotif();
    $scope.activeFavoriteIndex.push(index);
  };

  $scope.hideDescription = function(index) {
    resetFavoritesNotif();
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

  $scope.logOut = function() {
    resetFavoritesNotif();
    AuthenticationService.logout().success(function() {
      $location.path('/');
        $cookieStore.remove('displayname');
        $cookieStore.remove('email');
        $cookieStore.remove('language');
        $cookieStore.remove('databaseId');
    }).error(function (data) {
      if(angular.isString(data.message)){
        $scope.notifInfo = 'false';
        $rootScope.notifDanger = 'true';
        $rootScope.notification = data.message;
      }else{
        $location.path('/500');
      }
    });
  };
  
  function resetFavoritesNotif() { 
    $scope.notifInfo = 'false';
    $scope.notifDanger = 'false';
    $scope.notification = undefined;
  }
});
