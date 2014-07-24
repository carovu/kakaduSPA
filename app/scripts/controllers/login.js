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
    		$location.path('/courses');
    	}).error(function (data, config) {
    		console.log('error data:');
    		console.log(data);
      		console.log('error config:');
      		console.log(config);
		  });
  	};
});
