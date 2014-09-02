'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the kakaduSpaApp
 */
angular.module('kakaduSpaApp').controller('RegistrationCtrl', function ($scope, $rootScope, $location, RegistrationService) {
	//$scope.credentials = { displayname: '', email: '', password: '', password_confirmation: ''};

	$scope.register = function(){
		RegistrationService.register($scope.credentials).success(function () {
        	$rootScope.registrationNotif = 'You are registered.';
            $location.path('/');
    	}).error(function (data) {
    		$scope.notifDanger = 'true';
        	$scope.notification = data.message;
		});
	};
  });
