'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the kakaduSpaApp
 */
angular.module('kakaduSpaApp').controller('ProfileCtrl', function ($scope, $rootScope, $location, $cookieStore, ProfileService, SessionService, AuthenticationService) {
	//$scope.passwordCredentials = { password_old: '', password: '', password_confirmation:''};

  	$scope.editUser = function() {
		ProfileService.editUser($rootScope.userCredentials).success(function () {
	   		$scope.notifSuccess = 'true';
	   		$scope.notifDanger = 'false';
	    	$scope.notification = 'Your user information has been changed.';
		}).error(function (data) {
			$scope.notifSuccess = 'false';
			$scope.notifDanger = 'true';
	    	$scope.notification = data.message;
		});
	};

	$scope.changePwd = function() {
		ProfileService.changePwd($scope.passwordCredentials).success(function () {
	   		$scope.notifSuccess = 'true';
	   		$scope.notifDanger = 'false';
	    	$scope.notification = 'Your password has been changed.';
		}).error(function (data) {
			$scope.notifDanger = 'true';
	    	$scope.notification = data.message;
		});
	};

	$scope.deleteProfile = function() {
		ProfileService.deleteProfile().success(function () {
	   		$rootScope.registrationNotif = 'Your profile has been deleted';
	   		SessionService.unset('authenticated');
	   		$cookieStore.remove('databaseId');
	   		$location.path('/');
		}).error(function (data) {
			$scope.notifSuccess = 'false';
			$scope.notifDanger = 'true';
	    	$scope.notification = data.message;
		});
	};

	$scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        $rootScope.notifDanger = 'true';
        $rootScope.notification = data.message;
      });
    };
  });
