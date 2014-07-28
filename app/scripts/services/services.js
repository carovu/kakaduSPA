'use strict';

/**
 * @ngdoc service
 * @name kakaduSpaApp.services
 * @description
 * # services
 * Service in the kakaduSpaApp.
 */
 
var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);

kakaduServices.factory('TokenService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/token');
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

kakaduServices.factory('AuthenticationService', function($http,  $sanitize, SessionService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  return {
    login: function(credentials) {
      var login = $http.post('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
      login.success(cacheSession);
      return login;
    },
    logout: function() {
      var logout = $http.get('http://localhost/kakadu/public/api/spa/auth/logout');
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});

kakaduServices.factory('MultipleQuestion', function() {
  return {
    getAnswers: function(choices, answer) {
      var rightAnswerMultiple = [];
      angular.forEach(answer, function(answerNumber){
        rightAnswerMultiple.push(choices[answerNumber]);
      });
      return rightAnswerMultiple;
    }
  };
});