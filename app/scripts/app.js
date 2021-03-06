'use strict';

/**
 * @ngdoc overview
 * @name kakaduSpaApp
 * @description
 * # kakaduSpaApp
 *
 * Main module of the application.
 */

angular.module('kakaduSpaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDragDrop',
    'cgBusy',
    'ajoslin.promise-tracker',
    'kakaduSpaAppServices'
  ])
.config(function ($routeProvider, $httpProvider) {
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
  .when('/favorites', {
    templateUrl: 'views/favorites.html',
    controller: 'FavoritesCtrl'
  })
  .when('/favorites/learning', {
    templateUrl: 'views/favoritesquestion.html',
    controller: 'FavoritesQuestionCtrl'
  })
  .when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'ProfileCtrl'
  })
  .when('/registration', {
    templateUrl: 'views/registration.html',
    controller: 'RegistrationCtrl'
  })
  .when('/404', {
    templateUrl: '/404.html'
  })
  .when('/500', {
    templateUrl: '/500.html'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.run(function ($rootScope, $location, $http, TokenService, AuthenticationService) {
  TokenService.get().success(function(data){
    $http.defaults.headers.post['X-CSRF-Token'] = angular.fromJson(data);
  }).error(function (data, config) {
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
  });
  //make sure you cannot access other course view without being logged in
  var routesThatRequireAuth = ['/courses', '/favorites'];
  $rootScope.$on('$routeChangeStart', function() {
    if(window._(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      $rootScope.notifDanger = 'true';
      $rootScope.notification = 'You do not have permission. Have you tried logging in?';
    }
  });
});

