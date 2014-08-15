'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */

angular.module('kakaduSpaApp').controller('LoginCtrl', function ($rootScope, $scope, $location, $cookieStore, AuthenticationService) {
  	$scope.credentials = { email: '', password: ''};
    
  	$scope.login = function() {
    	AuthenticationService.login($scope.credentials).success(function (data) {
    		$location.path('/favorites');
    		$cookieStore.put('databaseId', data.id);
    	}).error(function (data) {
    		$scope.notifDanger = 'true';
        $scope.notification = data.message;
		});
  	};
});
