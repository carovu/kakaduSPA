'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */

angular.module('kakaduSpaApp').controller('LoginCtrl', function ($rootScope, $scope, $location, $cookieStore, AuthenticationService, FavoritesService) {
  	$scope.credentials = { email: '', password: ''};
    
  	$scope.login = function() {
    	AuthenticationService.login($scope.credentials).success(function (data) {
        FavoritesService.getFavorites().success(function(dataFav) {
          $scope.favorites = dataFav;
          if($scope.favorites.length === 0){
            $location.path('/courses');
          } else{
            $location.path('/favorites');
          }
        }).error(function (data) {
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
        });
    		$cookieStore.put('databaseId', data.id);
    	}).error(function (data) {
    		$scope.notifDanger = 'true';
        $scope.notification = data.message;
		});
  	};
});
