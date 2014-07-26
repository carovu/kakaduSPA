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

kakaduSpaApp.run(function($rootScope, $location, $http, TokenService, AuthenticationService) {
  TokenService.get().success(function(data){
    $http.defaults.headers.post['X-CSRF-Token'] = angular.fromJson(data);
  }).error(function (data, config) {
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
  });

  //make sure you cannot access other course view without being logged in
  var routesThatRequireAuth = ['/courses'];
  $rootScope.$on('$routeChangeStart', function() {
    if(window._(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      console.log('Please log in to continue.');
    }
  });
});

