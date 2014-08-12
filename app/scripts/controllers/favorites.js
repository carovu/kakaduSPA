'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:FavoritesCtrl
 * @description
 * # shows favorites of courses.
 */
angular.module('kakaduSpaApp').controller('FavoritesCtrl', function ($scope, $rootScope, $location, $route, $http, AuthenticationService, FavoritesService) {
  FavoritesService.getFavorites().success(function(data) {
		$scope.favorites = data;
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

    $scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
      }).error(function (data) {
        $rootScope.notification = data.message;
      });
    };
  });
