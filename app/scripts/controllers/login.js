'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */

angular.module('kakaduSpaApp').controller('LoginCtrl', function ($rootScope, $scope, $location, $cookieStore, AuthenticationService, FavoritesService) {
    $scope.credentials = { email: '', password: ''};

    //notification for registration
    if($scope.registrationNotif !== undefined){
      $scope.notifInfo = 'true';
      $scope.notifDanger = 'false';
      $scope.notification = $rootScope.registrationNotif;
      $rootScope.registrationNotif = undefined;
    }

  	$scope.login = function() {
      resetLoginNotif();
    	AuthenticationService.login($scope.credentials).success(function (data) {
        $cookieStore.put('displayname', data.displayname);
        $cookieStore.put('email', data.email);
        $cookieStore.put('language', data.language);
        $cookieStore.put('databaseId', data.id);
        FavoritesService.getFavorites().success(function(dataFav) {
          $scope.favorites = dataFav;
          if($scope.favorites.length === 0){
            $location.path('/courses');
          } else{
            $location.path('/favorites');
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

    function resetLoginNotif() {
      $scope.notifInfo = undefined;
      $scope.notifDanger = undefined; 
      $scope.notification = undefined;     
    }
});
