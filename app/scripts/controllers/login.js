'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */

angular.module('kakaduSpaApp').controller('LoginCtrl', function ($rootScope, $scope, $location, $cookieStore, AuthenticationService, FavoritesService) {
  	$scope.credentials = { email: '', password: ''};
    $rootScope.userCredentials = { displayname: '', email: '', language: ''};

    //notification for registration
    if($scope.registrationNotif !== undefined){
      $scope.notifInfo = 'true';
      $scope.notifDanger = 'false';
      $scope.notification = $rootScope.registrationNotif;
    }
  	$scope.login = function() {
    	AuthenticationService.login($scope.credentials).success(function (data) {
        $rootScope.userCredentials.displayname = data.displayname;
        $rootScope.userCredentials.email = data.email;
        $rootScope.userCredentials.language = data.language;
        $cookieStore.put('databaseId', data.id);
        FavoritesService.getFavorites().success(function(dataFav) {
          $scope.favorites = dataFav;
          if($scope.favorites.length === 0){
            $location.path('/courses');
          } else{
            $location.path('/favorites');
          }
        }).error(function (data) {
            $scope.notifInfo = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
        });
    		
    	}).error(function (data) {
        $scope.notifInfo = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
		  });
  	};
});
