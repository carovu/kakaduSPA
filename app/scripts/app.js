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
        controller: 'CourseListCtrl'
      })
      .when('/courses/:courseId', {
        templateUrl: 'views/course-question.html',
        controller: 'CourseQuestionCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
