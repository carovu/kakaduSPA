'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */

angular.module('kakaduSpaApp').controller('LoginCtrl', function($scope, $location, AuthenticationService) {
  	$scope.credentials = { email: '', password: ''};

  	$scope.login = function() {
    	AuthenticationService.login($scope.credentials).success(function() {
    		console.log('success');
    		$location.path('/courses');
    	});
  	};
});
