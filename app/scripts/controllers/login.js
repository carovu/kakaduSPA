'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */
 
angular.module('kakaduSpaApp')
  .controller('LoginCtrl', ['$scope', 'User',
  function($scope, User) {
    $scope.users = User.query();
  }]);