'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the kakaduSpaApp
 */
angular.module('kakaduSpaApp').controller('ProfileCtrl', function ($scope, $rootScope, $location, $cookieStore, ProfileService, SessionService, AuthenticationService) {
	$scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;

	//$scope.passwordCredentials = { password_old: '', password: '', password_confirmation:''};
	$scope.languages = [
      {id:'en', acronym:'en'} 
      //client is currently monobilingual
	  //{id:'de', acronym:'de'}
    ];
	$scope.userCredentials = { displayname: $cookieStore.get('displayname'), email: $cookieStore.get('email'), language: $cookieStore.get('language')};
  	$scope.editUser = function() {
  		resetProfileNotif();
		$scope.promise = ProfileService.editUser($scope.userCredentials).success(function () {
			$cookieStore.put('displayname', $scope.userCredentials.displayname);
        	$cookieStore.put('email', $scope.userCredentials.email);
        	$cookieStore.put('language', $scope.userCredentials.language);
	   		$scope.notifSuccess = 'true';
	   		$scope.notifDanger = 'false';
	    	$scope.notification = 'Your user information has been changed.';
		}).error(function (data) {
			if(angular.isString(data.message)){
				$scope.notifSuccess = 'false';
				$scope.notifDanger = 'true';
		    	$scope.notification = data.message;
			}else{
				$location.path('/500');
			}
		});
	};

	$scope.changePwd = function() {
  		resetProfileNotif();
		$scope.promise = ProfileService.changePwd($scope.passwordCredentials).success(function () {
	   		$scope.notifSuccess = 'true';
	   		$scope.notifDanger = 'false';
	    	$scope.notification = 'Your password has been changed.';
		}).error(function (data) {
			if(angular.isString(data.message)){
				$scope.notifDanger = 'true';
		    	$scope.notification = data.message;
			}else{
				$location.path('/500');
			}
		});
	};

	$scope.deleteProfile = function() {
  		resetProfileNotif();
		$scope.promise = ProfileService.deleteProfile().success(function () {
	   		$rootScope.registrationNotif = 'Your profile has been deleted';
	   		SessionService.unset('authenticated');
	   		$cookieStore.remove('databaseId');
	   		$location.path('/');
		}).error(function (data) {
			if(angular.isString(data.message)){
				$scope.notifSuccess = 'false';
				$scope.notifDanger = 'true';
		    	$scope.notification = data.message;
			}else{
				$location.path('/500');
			}
		});
	};

	$scope.logOut = function() {
  		resetProfileNotif();
	    AuthenticationService.logout().success(function() {
		    $location.path('/');
		    $cookieStore.remove('displayname');
		    $cookieStore.remove('email');
		    $cookieStore.remove('language');
		    $cookieStore.remove('databaseId');
	    }).error(function (data) {
	    	if(angular.isString(data.message)){
	        	$rootScope.notifDanger = 'true';
		        $rootScope.notification = data.message;
			}else{
				$location.path('/500');
			}
	    });
    };

    function resetProfileNotif() {
      $scope.notifSuccess = undefined;
      $scope.notifDanger = undefined;
      $scope.notification = undefined;     
    }
  });
