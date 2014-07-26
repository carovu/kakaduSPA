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
kakaduSpaApp.config([
  '$routeProvider',
  '$httpProvider',
  function ($routeProvider, $httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $routeProvider.when('/', {
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    }).when('/courses', {
      templateUrl: 'views/courses.html',
      controller: 'CourseListCtrl'
    }).when('/course/:courseId/learning', {
      templateUrl: 'views/coursequestion.html',
      controller: 'CourseQuestionCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);
kakaduSpaApp.run([
  '$rootScope',
  '$location',
  '$http',
  'TokenService',
  'AuthenticationService',
  function ($rootScope, $location, $http, TokenService, AuthenticationService) {
    TokenService.get().success(function (data) {
      $http.defaults.headers.post['X-CSRF-Token'] = angular.fromJson(data);
    }).error(function (data, config) {
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });
    //make sure you cannot access other course view without being logged in
    var routesThatRequireAuth = ['/courses'];
    $rootScope.$on('$routeChangeStart', function () {
      if (window._(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login');
        console.log('Please log in to continue.');
      }
    });
  }
]);
'use strict';
/**
 * @ngdoc service
 * @name kakaduSpaApp.services
 * @description
 * # services
 * Service in the kakaduSpaApp.
 */
var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);
kakaduServices.factory('TokenService', [
  '$http',
  function ($http) {
    return {
      get: function () {
        return $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/token');
      }
    };
  }
]);
kakaduServices.factory('CoursesService', [
  '$http',
  function ($http) {
    return {
      get: function () {
        return $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/courses');
      }
    };
  }
]);
kakaduServices.factory('SessionService', function () {
  return {
    get: function (key) {
      return sessionStorage.getItem(key);
    },
    set: function (key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function (key) {
      return sessionStorage.removeItem(key);
    }
  };
});
kakaduServices.factory('AuthenticationService', [
  '$http',
  '$sanitize',
  'SessionService',
  function ($http, $sanitize, SessionService) {
    var cacheSession = function () {
      SessionService.set('authenticated', true);
    };
    var uncacheSession = function () {
      SessionService.unset('authenticated');
    };
    return {
      login: function (credentials) {
        var login = $http.post('http://dbis-fw.uibk.ac.at:6680/api/spa/auth/login', JSON.stringify(credentials));
        login.success(cacheSession);
        return login;
      },
      logout: function () {
        var logout = $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/auth/logout');
        logout.success(uncacheSession);
        return logout;
      },
      isLoggedIn: function () {
        return SessionService.get('authenticated');
      }
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */
angular.module('kakaduSpaApp').controller('LoginCtrl', [
  '$scope',
  '$location',
  'AuthenticationService',
  function ($scope, $location, AuthenticationService) {
    $scope.credentials = {
      email: '',
      password: ''
    };
    $scope.login = function () {
      AuthenticationService.login($scope.credentials).success(function () {
        $location.path('/courses');
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
angular.module('kakaduSpaApp').controller('CourseListCtrl', [
  '$scope',
  '$location',
  'AuthenticationService',
  'CoursesService',
  function ($scope, $location, AuthenticationService, CoursesService) {
    CoursesService.get().success(function (data) {
      $scope.courses = data;
    });
    $scope.orderProp = 'age';
    $scope.logOut = function () {
      AuthenticationService.logout().success(function () {
        $location.path('/');
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };
  }
]);
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # Controller for questions of chosen course
*/
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  '$location',
  'AuthenticationService',
  function ($scope, $routeParams, $http, $location, AuthenticationService) {
    $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/course/' + $routeParams.courseId + '/learning').success(function (data) {
      $scope.question = data;
      $scope.nextQuestion = function () {
        //course bleibt immer gleich, quesiton und catalog id ändert sich, 
        //answer ist, ob der user die question richtig oder falsch beantwortet hat
        $scope.questionmodel = {
          question: $scope.question.id,
          course: $scope.question.course,
          catalog: $scope.question.catalog,
          section: 'course',
          answer: 'false'
        };
        $http.post('http://dbis-fw.uibk.ac.at:6680/api/spa/learning/next', $scope.questionmodel).success(function (data) {
          $scope.question = data;
          console.log(data);
        }).error(function (data, config) {
          $location.path('/');
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };
      $scope.logOut = function () {
        AuthenticationService.logout().success(function () {
        }).error(function (data, config) {
          $location.path('/course/' + $routeParams.courseId + '/learning');
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };
    }).error(function (data, config) {
      $location.path('/');
      console.log('Have you logged in?');
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });
  }
]);