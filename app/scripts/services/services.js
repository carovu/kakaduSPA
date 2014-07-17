'use strict';

/**
 * Services
 * It represents our RESTful client. We can make requests to the server for data in an easier way,
 * without having to deal with the lower-leve $http API, HTTP methods and URLs.
 */

var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);

kakaduServices.factory('Test', function($resource) {
  return $resource('/kakadu/public/api/v1/learning/next');
});

kakaduServices.factory("FlashService", function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  }
});

kakaduServices.factory('CoursesService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/courses');
    }
  };
});

kakaduServices.factory("SessionService", function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  }
});
