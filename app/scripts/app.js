'use strict';

/**
 * @ngdoc overview
 * @name kakaduSpaApp
 * @description
 * # kakaduSpaApp
 *
 * Main module of the application.
 */

var kakaduSpaApp = angular.module('kakaduSpaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'kakaduSpaAppServices'
  ]);
kakaduSpaApp.config(function ($routeProvider, $httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $routeProvider
  .when('/', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/courses', {
    templateUrl: 'views/courses.html',
    controller: 'CourseListCtrl'
  })
  .when('/course/:courseId/learning', {
    templateUrl: 'views/coursequestion.html',
    controller: 'CourseQuestionCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

kakaduSpaApp.run(function($http, $cookieStore, $cookies, $timeout, TokenService) {
  TokenService.get().success(function(data){
    $http.defaults.headers.post['X-CSRF-Token'] = angular.fromJson(data);
  }).error(function (data, config) {
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
  });
});
/*
kakaduSpaApp.config(function($httpProvider) {
  var logsOutUserOn401 = function($location, $q, SessionService, FlashService) {
    var success = function(response) {
      return response;
    };

    var error = function(response) {
      if(response.status === 401) {
        SessionService.unset('authenticated');
        $location.path('/login');
        FlashService.show(response.data.flash);
      }
      return $q.reject(response);
    };

    return function(promise) {
      return promise.then(success, error);
    };
  };

  $httpProvider.responseInterceptors.push(logsOutUserOn401);

});


kakaduSpaApp.run(function($rootScope, $location, AuthenticationService, FlashService) {
  var routesThatRequireAuth = ['/courses'];

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      FlashService.show("Please log in to continue.");
    }
  });
});
*/