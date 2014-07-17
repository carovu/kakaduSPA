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

kakaduSpaApp.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .when('/courses', {
    templateUrl: 'views/courses.html',
    controller: 'CourseListCtrl',
    resolve: {
      courses : function(CoursesService) {
        return CoursesService.get();
      }
    }
  })
  .when('/course/:courseId/learning', {
    templateUrl: 'views/course-question.html',
    controller: 'CourseQuestionCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
});

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

/*
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