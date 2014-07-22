'use strict';

/**
 * @ngdoc service
 * @name kakaduSpaApp.services
 * @description
 * # services
 * Service in the kakaduSpaApp.
 */
 
var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);

kakaduServices.factory('Test', function($resource) {
  return $resource('/kakadu/public/api/v1/learning/next');
});

kakaduServices.factory('FlashService', function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = '';
    }
  };
});

kakaduServices.factory('CoursesService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/courses');
    }
  };
});

kakaduServices.factory('TokenService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/token');
    }
  };
});

kakaduServices.factory('SessionService', function() {
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
  };
});

kakaduServices.factory('AuthenticationService', function($http, $sanitize, SessionService, FlashService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  var loginError = function(response) {
    FlashService.show(response.flash);
  };

  var sanitizeCredentials = function(credentials) {
    return {
      email: $sanitize(credentials.email),
      password: $sanitize(credentials.password),
    };
  };

  return {
    login: function(credentials) {
      console.log(JSON.stringify(sanitizeCredentials(credentials)));
      var login = $http.post('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
      login.success(cacheSession);
      login.success(FlashService.clear);
      login.error(loginError);
      return login;
    },
    logout: function() {
      var logout = $http.get('/auth/logout');
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});