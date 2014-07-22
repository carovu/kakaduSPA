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
  'kakaduSpaAppServices'
]).config([
  '$routeProvider',
  function ($routeProvider) {
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
'use strict';
/**
 * @ngdoc service
 * @name kakaduSpaApp.services
 * @description
 * # services
 * Service in the kakaduSpaApp.
 */
var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);
kakaduServices.factory('Test', [
  '$resource',
  function ($resource) {
    return $resource('/kakadu/public/api/v1/learning/next');
  }
]);
kakaduServices.factory('FlashService', [
  '$rootScope',
  function ($rootScope) {
    return {
      show: function (message) {
        $rootScope.flash = message;
      },
      clear: function () {
        $rootScope.flash = '';
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
  'FlashService',
  function ($http, $sanitize, SessionService, FlashService) {
    var cacheSession = function () {
      SessionService.set('authenticated', true);
    };
    var uncacheSession = function () {
      SessionService.unset('authenticated');
    };
    var loginError = function (response) {
      FlashService.show(response.flash);
    };
    var sanitizeCredentials = function (credentials) {
      return {
        email: $sanitize(credentials.email),
        password: $sanitize(credentials.password)
      };
    };
    return {
      login: function (credentials) {
        console.log(JSON.stringify(sanitizeCredentials(credentials)));
        var login = $http.post('http://dbis-fw.uibk.ac.at:6680api/spa/auth/login', JSON.stringify(credentials));
        login.success(cacheSession);
        login.success(FlashService.clear);
        login.error(loginError);
        return login;
      },
      logout: function () {
        var logout = $http.get('/auth/logout');
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
        console.log('success');
        $location.path('/courses');
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
    $scope.logout = function () {
      AuthenticationService.logout().success(function () {
        $location.path('/login');
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
  function ($scope, $routeParams, $http, $location, AuthenticationService) {
    $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/course/' + $routeParams.courseId + '/learning').success(function (data) {
      $scope.question = data;
      $scope.logout = function () {
        AuthenticationService.logout().success(function () {
          $location.path('/login');
        });
      };
    });
  }
]);