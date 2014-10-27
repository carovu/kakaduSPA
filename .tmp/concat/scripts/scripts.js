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
]).config([
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
    }).when('/favorites', {
      templateUrl: 'views/favorites.html',
      controller: 'FavoritesCtrl'
    }).when('/favorites/learning', {
      templateUrl: 'views/favoritesquestion.html',
      controller: 'FavoritesQuestionCtrl'
    }).when('/profile', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    }).when('/registration', {
      templateUrl: 'views/registration.html',
      controller: 'RegistrationCtrl'
    }).when('/404', { templateUrl: '/404.html' }).when('/500', { templateUrl: '/500.html' }).otherwise({ redirectTo: '/' });
  }
]).run([
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
    var routesThatRequireAuth = [
        '/courses',
        '/favorites'
      ];
    $rootScope.$on('$routeChangeStart', function () {
      if (window._(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
        $location.path('/login');
        $rootScope.notifDanger = 'true';
        $rootScope.notification = 'You do not have permission. Have you tried logging in?';
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
 * Services in the kakaduSpaApp.
 */
var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);
/**
 * Service offers function for the multiple choice question
 */
kakaduServices.factory('MultipleQuestionService', function () {
  return {
    getAnswers: function (choices, answer) {
      var rightAnswerMultiple = [];
      angular.forEach(answer, function (answerNumber) {
        rightAnswerMultiple.push(choices[answerNumber]);
      });
      return rightAnswerMultiple;
    },
    getAnswerFields: function (shuffledChoices, CorrectAnswer) {
      var rightAnswerMultipleField = [];
      angular.forEach(shuffledChoices, function (choice, index) {
        if (CorrectAnswer.indexOf(choice) !== -1) {
          rightAnswerMultipleField.push(index);
        }
      });
      return rightAnswerMultipleField;
    }
  };
});
/**
 * Service to store information in cache
 */
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
/**
 * Service to get csrf token from server
 */
kakaduServices.factory('TokenService', [
  '$http',
  function ($http) {
    return {
      get: function () {
        return $http.get('http://localhost/kakadu/public/api/spa/token');
      }
    };
  }
]);
/**
 * Service to get requests concerning courses from server
 */
kakaduServices.factory('CoursesService', [
  '$http',
  function ($http) {
    return {
      get: function () {
        return $http.get('http://localhost/kakadu/public/api/spa/courses');
      },
      getPage: function (currentPage, perPage, sort, sortDir) {
        return $http.get('http://localhost/kakadu/public/api/spa/courses?page=' + currentPage + '&per_page=' + perPage + '&sort=' + sort + '&sort_dir=' + sortDir);
      },
      search: function (searchInput) {
        return $http.get('http://localhost/kakadu/public/api/spa/courses/search?search=' + searchInput);
      }
    };
  }
]);
/**
 * Service to get requests concerning the quiz from server
 */
kakaduServices.factory('CourseQuestionService', [
  '$http',
  function ($http) {
    return {
      getCourse: function (courseId) {
        return $http.get('http://localhost/kakadu/public/api/spa/course/' + courseId + '/learning');
      },
      getLearnFavorites: function () {
        return $http.get('http://localhost/kakadu/public/api/spa/favorites/learning');
      },
      nextQuestion: function (questionmodel) {
        return $http.post('http://localhost/kakadu/public/api/spa/learning/next', questionmodel);
      }
    };
  }
]);
/**
 * Service to get requests concerning the favorites from server
 */
kakaduServices.factory('FavoritesService', [
  '$http',
  function ($http) {
    return {
      getFavorites: function () {
        return $http.get('http://localhost/kakadu/public/api/spa/favorites');
      },
      add: function (data) {
        return $http.post('http://localhost/kakadu/public/api/spa/favorites/add', data);
      },
      remove: function (data) {
        return $http.post('http://localhost/kakadu/public/api/spa/favorites/remove', data);
      }
    };
  }
]);
/**
 * Service to get requests concerning authentification from server
 */
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
        var login = $http.post('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
        login.success(cacheSession);
        return login;
      },
      logout: function () {
        var logout = $http.get('http://localhost/kakadu/public/api/spa/auth/logout');
        logout.success(uncacheSession);
        return logout;
      },
      isLoggedIn: function () {
        return SessionService.get('authenticated');
      }
    };
  }
]);
/**
 * Service to get requests concerning profile from server
 */
kakaduServices.factory('ProfileService', [
  '$http',
  function ($http) {
    return {
      editUser: function (credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/edit', JSON.stringify(credentials));
      },
      changePwd: function (credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/changepassword', JSON.stringify(credentials));
      },
      deleteProfile: function () {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/delete');
      }
    };
  }
]);
/**
 * Service to get requests concerning registration from server
 */
kakaduServices.factory('RegistrationService', [
  '$http',
  function ($http) {
    return {
      register: function (credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/auth/register', JSON.stringify(credentials));
      }
    };
  }
]);
'use strict';
/**
 * @ngdoc directive
 * @name kakaduSpaApp.directive:directives
 * @description
 * # Custom directives of this app: contains directives for cloze
 */
//directive to setup clozeQuestion in Quiz
angular.module('kakaduSpaApp').directive('clozeQuestion', function () {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: { ngModel: '=' },
    link: function (scope, element) {
      var question = scope.ngModel.question;
      var answers = scope.ngModel.answer;
      for (var i = 0; i < answers.length; i++) {
        var startPos = question.search(answers[i]);
        var endPos = startPos + answers[i].length;
        var before = question.substr(0, startPos);
        var after = question.substr(endPos, question.length);
        var gap = '<input type="text" id="answeredCloze[' + i + ']" style="background-color:#ababab; border:none"></input> <label id="' + answers[i] + '" style="color:#3c763d"></label>';
        question = before + gap + after;
      }
      element.html(question);
      //so if after a cloze question, another cloze question comes, it will be updated
      scope.$watch('ngModel', function () {
        question = scope.ngModel.question;
        answers = scope.ngModel.answer;
        for (var i = 0; i < answers.length; i++) {
          var startPos = question.search(answers[i]);
          var endPos = startPos + answers[i].length;
          var before = question.substr(0, startPos);
          var after = question.substr(endPos, question.length);
          var gap = '<input type="text" id="answeredCloze[' + i + ']" style="background-color:#ababab; border:none"></input> <label id="' + answers[i] + '" style="color:#3c763d"></label>';
          question = before + gap + after;
        }
        element.html(question);
      });
    }
  };
});
//directive for header, when logged in
angular.module('kakaduSpaApp').directive('header', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/header.html'
  };
});
//directive for header in index.html = when not logged in
angular.module('kakaduSpaApp').directive('headerIndex', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/index-header.html'
  };
});
//directive for header, when logged in
angular.module('kakaduSpaApp').directive('footer', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/index-footer.html'
  };
});
//directive for searching the courses in courses.html, searches courses in the whole database
angular.module('kakaduSpaApp').directive('search', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/courses-search.html'
  };
});
//directive for the sorting button in courses(courses.html)
angular.module('kakaduSpaApp').directive('sorting', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/courses-sorting.html'
  };
});
//directive for paginating the courses in courses.html
angular.module('kakaduSpaApp').directive('paginate', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/courses-pagination.html'
  };
});
//directive for showing all courses
angular.module('kakaduSpaApp').directive('listCourses', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/courses-list.html'
  };
});
//directive for searching the courses in favorites.html, searches favorites you have
angular.module('kakaduSpaApp').directive('searchSort', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/favorites-search-sort.html'
  };
});
//directive for showing the favorites courses
angular.module('kakaduSpaApp').directive('listFavorites', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/favorites-list.html'
  };
});
//directive for showing the progressbar
angular.module('kakaduSpaApp').directive('progressbar', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/coursequestion-progressbar.html'
  };
});
//directive for showing the questiontypes
angular.module('kakaduSpaApp').directive('questiontypes', function () {
  return {
    restrict: 'E',
    templateUrl: 'views/directives/coursequestion-questiontypes.html'
  };
});
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:LoginCtrl
 * @description
 * # Controller for the login
 */
angular.module('kakaduSpaApp').controller('LoginCtrl', [
  '$rootScope',
  '$scope',
  '$location',
  '$cookieStore',
  'AuthenticationService',
  'FavoritesService',
  function ($rootScope, $scope, $location, $cookieStore, AuthenticationService, FavoritesService) {
    $scope.credentials = {
      email: '',
      password: ''
    };
    //notification for registration
    if ($scope.registrationNotif !== undefined) {
      $scope.notifInfo = 'true';
      $scope.notifDanger = 'false';
      $scope.notification = $rootScope.registrationNotif;
      $rootScope.registrationNotif = undefined;
    }
    $scope.login = function () {
      resetLoginNotif();
      AuthenticationService.login($scope.credentials).success(function (data) {
        $cookieStore.put('displayname', data.displayname);
        $cookieStore.put('email', data.email);
        $cookieStore.put('language', data.language);
        $cookieStore.put('databaseId', data.id);
        FavoritesService.getFavorites().success(function (dataFav) {
          $scope.favorites = dataFav;
          if ($scope.favorites.length === 0) {
            $location.path('/courses');
          } else {
            $location.path('/favorites');
          }
        }).error(function (data) {
          if (angular.isString(data.message)) {
            $scope.notifInfo = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          } else {
            $location.path('/500');
          }
        });
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifInfo = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    function resetLoginNotif() {
      $scope.notifInfo = undefined;
      $scope.notifDanger = undefined;
      $scope.notification = undefined;
    }
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
  '$rootScope',
  '$location',
  '$http',
  '$cookieStore',
  'AuthenticationService',
  'CoursesService',
  'FavoritesService',
  function ($scope, $rootScope, $location, $http, $cookieStore, AuthenticationService, CoursesService, FavoritesService) {
    $scope.orderProp = 'age';
    $scope.descript = 'false';
    $scope.activeCourseIndex = [];
    $scope.userId = $cookieStore.get('databaseId');
    $scope.notifSuccess = 'false';
    $scope.notifDanger = 'false';
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.promise = CoursesService.get().success(function (data) {
      $scope.courses = data;
      //pagination
      $scope.currentPage = 1;
      $scope.pageSize = 20;
      $scope.sort = 'name';
      //data.sort;
      $scope.sortDir = 'asc';
      // data.sort_dir; 
      $scope.setCurrentPage = function (currentPage) {
        resetCoursesNotif();
        $scope.currentPage = currentPage + 1;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
          $scope.courses = data;
        }).error(function (data) {
          if (angular.isString(data.message)) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          } else {
            $location.path('/500');
          }
        });
      };
      $scope.nextPage = function () {
        resetCoursesNotif();
        if ($scope.currentPage !== Math.ceil($scope.courses.total / $scope.pageSize)) {
          $scope.currentPage++;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
            $scope.courses = data;
          }).error(function (data) {
            if (angular.isString(data.message)) {
              $scope.notifSuccess = 'false';
              $scope.notifDanger = 'true';
              $scope.notification = data.message;
            } else {
              $location.path('/500');
            }
          });
        }
      };
      $scope.previousPage = function () {
        resetCoursesNotif();
        if ($scope.currentPage !== 1) {
          $scope.currentPage--;
          CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
            $scope.courses = data;
          }).error(function (data) {
            if (angular.isString(data.message)) {
              $scope.notifSuccess = 'false';
              $scope.notifDanger = 'true';
              $scope.notification = data.message;
            } else {
              $location.path('/500');
            }
          });
        }
      };
      $scope.getNumberAsArray = function (num) {
        return new Array(num);
      };
      $scope.numberOfPages = function () {
        return Math.ceil($scope.courses.total / $scope.pageSize);
      };
      $scope.changePageSize = function (size) {
        resetCoursesNotif();
        $scope.pageSize = size;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
          $scope.courses = data;
        }).error(function (data) {
          if (angular.isString(data.message)) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          } else {
            $location.path('/500');
          }
        });
      };
      $scope.sortBy = function (sort) {
        resetCoursesNotif();
        $scope.sort = sort;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
          $scope.courses = data;
        }).error(function (data) {
          if (angular.isString(data.message)) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          } else {
            $location.path('/500');
          }
        });
      };
      $scope.orderBy = function (order) {
        resetCoursesNotif();
        $scope.sortDir = order;
        CoursesService.getPage($scope.currentPage, $scope.pageSize, $scope.sort, $scope.sortDir).success(function (data) {
          $scope.courses = data;
        }).error(function (data) {
          if (angular.isString(data.message)) {
            $scope.notifSuccess = 'false';
            $scope.notifDanger = 'true';
            $scope.notification = data.message;
          } else {
            $location.path('/500');
          }
        });
      };
    }).error(function (data) {
      if (angular.isString(data.message)) {
        $scope.notifSuccess = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
      } else {
        $location.path('/500');
      }
    });
    $scope.search = function (searchInput) {
      resetCoursesNotif();
      CoursesService.search(searchInput).success(function (data) {
        $scope.courses = data;
        if ($scope.courses.total === 0) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = 'The course does not exist.';
        }
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.addFavorite = function (courseId) {
      resetCoursesNotif();
      $scope.favoritemodel = {
        id: courseId,
        type: 'course'
      };
      FavoritesService.add($scope.favoritemodel).success(function (data) {
        $scope.notifSuccess = 'true';
        $scope.notifDanger = 'false';
        $scope.notification = 'Course has been added to Your courses';
        $scope.courses = data;
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.showDescription = function (index) {
      resetCoursesNotif();
      $scope.activeCourseIndex.push(index);
    };
    $scope.hideDescription = function (index) {
      resetCoursesNotif();
      if ($scope.activeCourseIndex.indexOf(index) !== -1) {
        $scope.activeCourseIndex.splice($scope.activeCourseIndex.indexOf(index), 1);
      }
    };
    $scope.isShowing = function (index) {
      //if index is in array
      if ($scope.activeCourseIndex.indexOf(index) !== -1) {
        return true;
      }
    };
    $scope.logOut = function () {
      resetCoursesNotif();
      AuthenticationService.logout().success(function () {
        $location.path('/');
        $cookieStore.remove('displayname');
        $cookieStore.remove('email');
        $cookieStore.remove('language');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    function resetCoursesNotif() {
      $scope.notifSuccess = 'false';
      $scope.notifDanger = 'false';
      $scope.notification = undefined;
    }
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # CourseQuestionCtrl
 * # Controller for questions of chosen course
 */
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', [
  '$rootScope',
  '$scope',
  '$routeParams',
  '$http',
  '$location',
  '$cookieStore',
  'AuthenticationService',
  'CourseQuestionService',
  'MultipleQuestionService',
  function ($rootScope, $scope, $routeParams, $http, $location, $cookieStore, AuthenticationService, CourseQuestionService, MultipleQuestionService) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.showStat = 'false';
    $scope.promise = CourseQuestionService.getCourse($routeParams.courseId).success(function (data) {
      //Global variables
      $scope.question = data;
      $scope.checkAnswer = 'false';
      //check variable, wheter user answered question right or wrong
      $scope.message = '';
      //notification, how you answered
      $scope.mSuccess = '';
      //notification for correctly answered
      $scope.mFailure = '';
      //notification for falsely answered
      $scope.notifSuccess = 'false';
      $scope.notifFailure = 'false';
      $scope.numCorrectPercentage = $scope.question.numCorrect / $scope.question.numAnswered * 100;
      $scope.numIncorrectPercentage = $scope.question.numIncorrect / $scope.question.numAnswered * 100;
      //variables for the different types
      if ($scope.question.type === 'simple') {
        $scope.showSimpleAnswer = 'false';
        $scope.simpleAnswered = 'false';  // for correct, wrong and next button
      } else if ($scope.question.type === 'multiple') {
        $scope.chosenChoisesMultiple = [];
        $scope.choicesFieldNum = [];
        //remembers the number of the chosen fields
        //fill rightAnswersMultiple array with the right answers
        if ($scope.question.choices) {
          $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
        }
        $scope.showCheckMultiple = 'true';
        //hide check button
        $scope.showNextMultiple = 'false';
        //show next button
        $scope.showSolution = 'false';
        //show solution button
        $scope.chooseButtonMultiple = [];
        //number, of which choice field is clicked
        $scope.shuffledChoices = shuffle($scope.question.choices);
        //shuffle choices
        $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple);  //like question.answer, but for shuffled array
      } else if ($scope.question.type === 'dragdrop') {
        $scope.choiceDrop = '';
        //dropped choice in answer field    
        $scope.shuffledChoices = shuffle($scope.question.choices);
      } else if ($scope.question.type === 'cloze') {
        $scope.answeredCloze = [];
        //contains answers of the gaps 
        $scope.numRightGaps = 0;
        //number of correct answered gaps
        $scope.showCheckCloze = 'true';
        $scope.showNextCloze = 'false';
        $scope.disableCloze = 0;  //variable to disable input field or not
      }
      /*
          functions for simple questions
          */
      //show answer
      $scope.showSimple = function () {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true';  //show correct, wrong button in simple
      };
      //user did remember answer correctly 
      $scope.simpleAnswerCorrect = function () {
        $scope.checkAnswer = 'true';
        $scope.notifSuccess = 'true';
        $scope.mSuccess = 'You answered correct.';
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      //user did not remember answer correctly
      $scope.simpleAnswerWrong = function () {
        $scope.checkAnswer = 'false';
        $scope.notifFailure = 'true';
        $scope.mFailure = 'You answered wrong.';
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      /*
          functions for mutliple questions
          */
      //put chosen answers into array chosenChoisesMultiple. array is unique.
      //cannot undo. what is in array, remains in array
      //field is number of field, so you know which field will change color, once it is clicked
      $scope.chooseChoiceMultiple = function (choice, field) {
        if ($scope.choicesFieldNum.indexOf(field) === -1) {
          $scope.chooseButtonMultiple[field] = {
            'border-style': 'solid',
            'border-width': 'thick'
          };
          $scope.choicesFieldNum.push(field);
          //check for uniqeness
          if ($scope.chosenChoisesMultiple.indexOf(choice) === -1) {
            //push choice into array
            $scope.chosenChoisesMultiple.push(choice);
          }
        } else {
          $scope.chooseButtonMultiple[field] = { 'background-color': 'white' };
          //delete your choice from fieldnumberarray
          for (var i = $scope.choicesFieldNum.length - 1; i >= 0; i--) {
            if ($scope.choicesFieldNum[i] === field) {
              $scope.choicesFieldNum.splice(i, 1);
            }
          }
          //delete your choice from the chosenchoisesarray
          for (var x = $scope.chosenChoisesMultiple.length - 1; x >= 0; x--) {
            if ($scope.chosenChoisesMultiple[x] === choice) {
              $scope.chosenChoisesMultiple.splice(x, 1);
            }
          }
        }
      };
      //check the chosen answers with solutionanswer
      //every choice has to be right, otherwise, answered wrong.
      //there is no halfright or halfwrong
      $scope.checkMultiple = function () {
        var wrongAnswered = 0;
        $scope.showCheckMultiple = 'false';
        $scope.showNextMultiple = 'true';
        //in case you skip question and choose nothing, will be counted as a wrong answer
        if ($scope.chosenChoisesMultiple.length === 0) {
          wrongAnswered++;
          angular.forEach($scope.correctAnswerField, function (answerNumber) {
            $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
          });
        }
        //iterate through multiple choice array, answer is the item of array
        angular.forEach($scope.chosenChoisesMultiple, function (choice, key) {
          if ($scope.rightAnswersMultiple.indexOf(choice) === -1) {
            wrongAnswered++;
            $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {
              'background-color': '#f2dede',
              'border-style': 'solid',
              'border-width': 'thick'
            };
          } else {
            $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {
              'background-color': '#dff0d8',
              'border-style': 'solid',
              'border-width': 'thick'
            };
          }
        });
        //setting false is unnecessary, because checkanswer is false by default
        if (wrongAnswered === 0) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.mSuccess = 'You answered correct.';
        } else {
          if ($scope.chosenChoisesMultiple.length === 0) {
            $scope.notifFailure = 'true';
            $scope.mFailure = 'You answered wrong.';
          } else {
            $scope.showSolution = 'true';
            $scope.notifFailure = 'true';
            $scope.mFailure = 'You answered wrong.';
          }
        }
      };
      $scope.showCorrectAnswers = function () {
        $scope.showSolution = 'false';
        angular.forEach($scope.correctAnswerField, function (answerNumber) {
          $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
        });
      };
      /*
          functions for DragDrop questions
          */
      //drop event
      $scope.dropCallback = function (event, ui, choice) {
        $scope.mSuccess = 'You answered correct.';
        //angular.element(ui.draggable).scope().choiceDrop
        if ($scope.question.answer === choice) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.notifFailure = 'false';
          $scope.mSuccess = 'You answered correct.';
        } else {
          $scope.notifSuccess = 'false';
          $scope.notifFailure = 'true';
          $scope.mFailure = 'You answered wrong.';
        }
      };
      //hide or show draggable
      $scope.showDraggable = function (content) {
        //is a choice
        if ($scope.question.choices.indexOf(content) !== -1) {
          return true;
        } else {
          return false;
        }
      };
      /*
          * functions for cloze questions
          */
      //checking cloze, we are using jquery, because offered AJS directives are not useful enough
      $scope.checkCloze = function () {
        $scope.showCheckCloze = 'false';
        $scope.showNextCloze = 'true';
        angular.forEach($scope.question.answer, function (answer, i) {
          if (angular.lowercase(angular.element(document.getElementById('answeredCloze[' + i + ']')).val()) === angular.lowercase(answer)) {
            $scope.numRightGaps++;
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#dff0d8');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.borderColor = '#d6e9c6');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.color = '#3c763d');
          } else {
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#f2dede');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.borderColor = '#ebccd1');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.color = '#a94442');
            angular.element(document.getElementById(answer).innerHTML = answer);
          }
          angular.element(document.getElementById('answeredCloze[' + i + ']').setAttribute('disabled', true));
        });
        if ($scope.numRightGaps === $scope.question.answer.length) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.mSuccess = 'You answered correct.';
        } else {
          $scope.notifFailure = 'true';
          $scope.mFailure = 'You answered wrong.';
        }
        $scope.disableCloze++;
      };
      /*
          Global functions
          */
      $scope.nextQuestion = function () {
        $scope.questionmodel = {
          question: $scope.question.id,
          course: $scope.question.course,
          catalog: $scope.question.catalog,
          section: 'course',
          answer: $scope.checkAnswer
        };
        CourseQuestionService.nextQuestion($scope.questionmodel).success(function (data) {
          $scope.question = data;
          $scope.checkAnswer = 'false';
          $scope.message = '';
          $scope.mSuccess = '';
          $scope.mFailure = '';
          $scope.notifSuccess = 'false';
          $scope.notifFailure = 'false';
          $scope.numCorrectPercentage = $scope.question.numCorrect / $scope.question.numAnswered * 100;
          $scope.numIncorrectPercentage = $scope.question.numIncorrect / $scope.question.numAnswered * 100;
          if ($scope.question.type === 'simple') {
            $scope.showSimpleAnswer = 'false';
            $scope.simpleAnswered = 'false';
          } else if ($scope.question.type === 'multiple') {
            $scope.chosenChoisesMultiple = [];
            $scope.choicesFieldNum = [];
            if ($scope.question.choices) {
              $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
            }
            $scope.showCheckMultiple = 'true';
            $scope.showNextMultiple = 'false';
            $scope.showSolution = 'false';
            //show solution button
            $scope.chooseButtonMultiple = [];
            $scope.shuffledChoices = shuffle($scope.question.choices);
            $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple);
          } else if ($scope.question.type === 'dragdrop') {
            //angular.element(document.getElementById('choiceDragDrop')).scope().choiceDrop = '';
            $scope.choiceDrop = '';
            $scope.shuffledChoices = shuffle($scope.question.choices);
          } else if ($scope.question.type === 'cloze') {
            $scope.answeredCloze = [];
            $scope.numRightGaps = 0;
            $scope.showCheckCloze = 'true';
            $scope.showNextCloze = 'false';
            $scope.disableCloze = 0;
          }
        }).error(function (data) {
          $location.path('/');
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        });
      };
      $scope.showStatistic = function () {
        if ($scope.showStat === 'false') {
          $scope.showStat = 'true';
        } else {
          $scope.showStat = 'false';
        }
      };
      $scope.logOut = function () {
        AuthenticationService.logout().success(function () {
          $cookieStore.remove('displayname');
          $cookieStore.remove('email');
          $cookieStore.remove('language');
          $cookieStore.remove('databaseId');
        }).error(function (data) {
          $location.path('/course/' + $routeParams.courseId + '/learning');
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        });
      };
    }).error(function (data) {
      $location.path('/');
      $rootScope.notifDanger = 'true';
      $rootScope.notification = data.message + '. Have you logged in?';
    });
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:FavoritesCtrl
 * @description
 * # shows favorites of courses.
 */
angular.module('kakaduSpaApp').controller('FavoritesCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  '$http',
  '$cookieStore',
  'AuthenticationService',
  'FavoritesService',
  function ($scope, $rootScope, $location, $http, $cookieStore, AuthenticationService, FavoritesService) {
    $scope.activeFavoriteIndex = [];
    $scope.notifInfo = 'false';
    $scope.notifDanger = 'false';
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.promise = FavoritesService.getFavorites().success(function (data) {
      $scope.favorites = data;
      if ($scope.favorites.length === 0) {
        $scope.notifInfo = 'true';
        $scope.notifDanger = 'false';
        $scope.notification = 'Your list is currently empty';
      }
    }).error(function (data) {
      if (angular.isString(data.message)) {
        $scope.notifInfo = 'false';
        $scope.notifDanger = 'true';
        $scope.notification = data.message;
      } else {
        $location.path('/500');
      }
    });
    $scope.orderProp = 'age';
    $scope.removeFavorite = function (favoriteId) {
      resetFavoritesNotif();
      $scope.favoritemodel = {
        id: favoriteId,
        type: 'course'
      };
      FavoritesService.remove($scope.favoritemodel).success(function (data) {
        $scope.favorites = data;
        if ($scope.favorites.length === 0) {
          $scope.notifInfo = 'true';
          $scope.notifDanger = 'false';
          $scope.notification = 'Your list is currently empty';
        }
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifInfo = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.showDescription = function (index) {
      resetFavoritesNotif();
      $scope.activeFavoriteIndex.push(index);
    };
    $scope.hideDescription = function (index) {
      resetFavoritesNotif();
      if ($scope.activeFavoriteIndex.indexOf(index) !== -1) {
        $scope.activeFavoriteIndex.splice($scope.activeFavoriteIndex.indexOf(index), 1);
      }
    };
    $scope.isShowing = function (index) {
      //if index is in array
      if ($scope.activeFavoriteIndex.indexOf(index) !== -1) {
        return true;
      }
    };
    $scope.logOut = function () {
      resetFavoritesNotif();
      AuthenticationService.logout().success(function () {
        $location.path('/');
        $cookieStore.remove('displayname');
        $cookieStore.remove('email');
        $cookieStore.remove('language');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifInfo = 'false';
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    function resetFavoritesNotif() {
      $scope.notifInfo = 'false';
      $scope.notifDanger = 'false';
      $scope.notification = undefined;
    }
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:FavoritesQuestionCtrl
 * @description
 * # FavoritesQuestionCtrl
 * # Controller for questions of chosen course
 */
angular.module('kakaduSpaApp').controller('FavoritesQuestionCtrl', [
  '$rootScope',
  '$scope',
  '$routeParams',
  '$http',
  '$location',
  '$cookieStore',
  'AuthenticationService',
  'CourseQuestionService',
  'MultipleQuestionService',
  function ($rootScope, $scope, $routeParams, $http, $location, $cookieStore, AuthenticationService, CourseQuestionService, MultipleQuestionService) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.promise = CourseQuestionService.getLearnFavorites().success(function (data) {
      //Global variables
      $scope.question = data;
      $scope.checkAnswer = 'false';
      //check variable, wheter user answered question right or wrong
      $scope.message = '';
      //notification, how you answered
      $scope.mSuccess = '';
      //notification for correctly answered
      $scope.mFailure = '';
      //notification for falsely answered
      $scope.notifSuccess = 'false';
      $scope.notifFailure = 'false';
      //variables for the different types
      if ($scope.question.type === 'simple') {
        $scope.showSimpleAnswer = 'false';
        $scope.simpleAnswered = 'false';  // for correct, wrong and next button
      } else if ($scope.question.type === 'multiple') {
        $scope.chosenChoisesMultiple = [];
        $scope.choicesFieldNum = [];
        //remembers the number of the chosen fields
        //fill rightAnswersMultiple array with the right answers
        if ($scope.question.choices) {
          $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
        }
        $scope.showCheckMultiple = 'true';
        //hide check button
        $scope.showNextMultiple = 'false';
        //show next button
        $scope.showSolution = 'false';
        //show solution button
        $scope.chooseButtonMultiple = [];
        //number, of which choice field is clicked
        $scope.shuffledChoices = shuffle($scope.question.choices);
        //shuffle choices
        $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple);  //like question.answer, but for shuffled array
      } else if ($scope.question.type === 'dragdrop') {
        $scope.choiceDrop = '';
        //dropped choice in answer field    
        $scope.shuffledChoices = shuffle($scope.question.choices);
      } else if ($scope.question.type === 'cloze') {
        $scope.answeredCloze = [];
        //contains answers of the gaps 
        $scope.numRightGaps = 0;
        //number of correct answered gaps
        $scope.showCheckCloze = 'true';
        $scope.showNextCloze = 'false';
        $scope.disableCloze = 0;  //variable to disable input field or not
      }
      /*
      functions for simple questions
      */
      //show answer
      $scope.showSimple = function () {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true';  //show correct, wrong button in simple
      };
      //user did remember answer correctly 
      $scope.simpleAnswerCorrect = function () {
        $scope.checkAnswer = 'true';
        $scope.notifSuccess = 'true';
        $scope.mSuccess = 'You answered correct.';
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      //user did not remember answer correctly
      $scope.simpleAnswerWrong = function () {
        $scope.checkAnswer = 'false';
        $scope.notifFailure = 'true';
        $scope.mFailure = 'You answered wrong.';
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      /*
      functions for mutliple questions
      */
      //put chosen answers into array chosenChoisesMultiple. array is unique.
      //cannot undo. what is in array, remains in array
      //field is number of field, so you know which field will change color, once it is clicked
      $scope.chooseChoiceMultiple = function (choice, field) {
        if ($scope.choicesFieldNum.indexOf(field) === -1) {
          $scope.chooseButtonMultiple[field] = {
            'border-style': 'solid',
            'border-width': 'thick'
          };
          $scope.choicesFieldNum.push(field);
          //check for uniqeness
          if ($scope.chosenChoisesMultiple.indexOf(choice) === -1) {
            //push choice into array
            $scope.chosenChoisesMultiple.push(choice);
          }
        } else {
          $scope.chooseButtonMultiple[field] = { 'background-color': 'white' };
          //delete your choice from fieldnumberarray
          for (var i = $scope.choicesFieldNum.length - 1; i >= 0; i--) {
            if ($scope.choicesFieldNum[i] === field) {
              $scope.choicesFieldNum.splice(i, 1);
            }
          }
          //delete your choice from the chosenchoisesarray
          for (var x = $scope.chosenChoisesMultiple.length - 1; x >= 0; x--) {
            if ($scope.chosenChoisesMultiple[x] === choice) {
              $scope.chosenChoisesMultiple.splice(x, 1);
            }
          }
        }
      };
      //check the chosen answers with solutionanswer
      //every choice has to be right, otherwise, answered wrong.
      //there is no halfright or halfwrong
      $scope.checkMultiple = function () {
        var wrongAnswered = 0;
        $scope.showCheckMultiple = 'false';
        $scope.showNextMultiple = 'true';
        //in case you skip question and choose nothing, will be counted as a wrong answer
        if ($scope.chosenChoisesMultiple.length === 0) {
          wrongAnswered++;
          angular.forEach($scope.correctAnswerField, function (answerNumber) {
            $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
          });
        }
        //iterate through multiple choice array, answer is the item of array
        angular.forEach($scope.chosenChoisesMultiple, function (choice, key) {
          if ($scope.rightAnswersMultiple.indexOf(choice) === -1) {
            wrongAnswered++;
            $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {
              'background-color': '#f2dede',
              'border-style': 'solid',
              'border-width': 'thick'
            };
          } else {
            $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {
              'background-color': '#dff0d8',
              'border-style': 'solid',
              'border-width': 'thick'
            };
          }
        });
        //setting false is unnecessary, because checkanswer is false by default
        if (wrongAnswered === 0) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.mSuccess = 'You answered correct.';
        } else {
          if ($scope.chosenChoisesMultiple.length === 0) {
            $scope.notifFailure = 'true';
            $scope.mFailure = 'You answered wrong.';
          } else {
            $scope.showSolution = 'true';
            $scope.notifFailure = 'true';
            $scope.mFailure = 'You answered wrong.';
          }
        }
      };
      $scope.showCorrectAnswers = function () {
        $scope.showSolution = 'false';
        angular.forEach($scope.correctAnswerField, function (answerNumber) {
          $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
        });
      };
      /*
      functions for DragDrop questions
      */
      //drop event
      $scope.dropCallback = function (event, ui, choice) {
        $scope.mSuccess = 'You answered correct.';
        //angular.element(ui.draggable).scope().choiceDrop
        if ($scope.question.answer === choice) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.notifFailure = 'false';
          $scope.mSuccess = 'You answered correct.';
        } else {
          $scope.notifSuccess = 'false';
          $scope.notifFailure = 'true';
          $scope.mFailure = 'You answered wrong.';
        }
      };
      //hide or show draggable
      $scope.showDraggable = function (content) {
        //is a choice
        if ($scope.question.choices.indexOf(content) !== -1) {
          return true;
        } else {
          return false;
        }
      };
      /*
      * functions for cloze questions
      */
      //checking cloze, we are using jquery, because offered AJS directives are not useful enough
      $scope.checkCloze = function () {
        $scope.showCheckCloze = 'false';
        $scope.showNextCloze = 'true';
        angular.forEach($scope.question.answer, function (answer, i) {
          if (angular.lowercase(angular.element(document.getElementById('answeredCloze[' + i + ']')).val()) === angular.lowercase(answer)) {
            $scope.numRightGaps++;
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#dff0d8');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.borderColor = '#d6e9c6');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.color = '#3c763d');
          } else {
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#f2dede');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.borderColor = '#ebccd1');
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.color = '#a94442');
            angular.element(document.getElementById(answer).innerHTML = answer);
          }
          angular.element(document.getElementById('answeredCloze[' + i + ']').setAttribute('disabled', true));
        });
        if ($scope.numRightGaps === $scope.question.answer.length) {
          $scope.checkAnswer = 'true';
          $scope.notifSuccess = 'true';
          $scope.mSuccess = 'You answered correct.';
        } else {
          $scope.notifFailure = 'true';
          $scope.mFailure = 'You answered wrong.';
        }
        $scope.disableCloze++;
      };
      /*
      Global functions
      */
      $scope.nextQuestion = function () {
        $scope.questionmodel = {
          question: $scope.question.id,
          course: $scope.question.course,
          catalog: $scope.question.catalog,
          section: 'favorites',
          answer: $scope.checkAnswer
        };
        CourseQuestionService.nextQuestion($scope.questionmodel).success(function (data) {
          $scope.question = data;
          $scope.checkAnswer = 'false';
          $scope.message = '';
          $scope.mSuccess = '';
          $scope.mFailure = '';
          $scope.notifSuccess = 'false';
          $scope.notifFailure = 'false';
          if ($scope.question.type === 'simple') {
            $scope.showSimpleAnswer = 'false';
            $scope.simpleAnswered = 'false';
          } else if ($scope.question.type === 'multiple') {
            $scope.chosenChoisesMultiple = [];
            $scope.choicesFieldNum = [];
            if ($scope.question.choices) {
              $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
            }
            $scope.showCheckMultiple = 'true';
            $scope.showNextMultiple = 'false';
            $scope.showSolution = 'false';
            //show solution button
            $scope.chooseButtonMultiple = [];
            $scope.shuffledChoices = shuffle($scope.question.choices);
            $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple);
          } else if ($scope.question.type === 'dragdrop') {
            //angular.element(document.getElementById('choiceDragDrop')).scope().choiceDrop = '';
            $scope.choiceDrop = '';
            $scope.shuffledChoices = shuffle($scope.question.choices);
          } else if ($scope.question.type === 'cloze') {
            $scope.answeredCloze = [];
            $scope.numRightGaps = 0;
            $scope.showCheckCloze = 'true';
            $scope.showNextCloze = 'false';
            $scope.disableCloze = 0;
          }
        }).error(function (data) {
          $location.path('/');
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        });
      };
      $scope.logOut = function () {
        AuthenticationService.logout().success(function () {
          $cookieStore.remove('displayname');
          $cookieStore.remove('email');
          $cookieStore.remove('language');
          $cookieStore.remove('databaseId');
        }).error(function (data) {
          $location.path('/course/' + $routeParams.courseId + '/learning');
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        });
      };
    }).error(function (data) {
      $location.path('/');
      $rootScope.notifDanger = 'true';
      $rootScope.notification = data.message + '. Have you logged in?';
    });
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the kakaduSpaApp
 */
angular.module('kakaduSpaApp').controller('ProfileCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  '$cookieStore',
  'ProfileService',
  'SessionService',
  'AuthenticationService',
  function ($scope, $rootScope, $location, $cookieStore, ProfileService, SessionService, AuthenticationService) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    //$scope.passwordCredentials = { password_old: '', password: '', password_confirmation:''};
    $scope.languages = [{
        id: 'en',
        acronym: 'en'
      }];
    $scope.userCredentials = {
      displayname: $cookieStore.get('displayname'),
      email: $cookieStore.get('email'),
      language: $cookieStore.get('language')
    };
    $scope.editUser = function () {
      resetProfileNotif();
      $scope.promise = ProfileService.editUser($scope.userCredentials).success(function () {
        $cookieStore.put('displayname', $scope.userCredentials.displayname);
        $cookieStore.put('email', $scope.userCredentials.email);
        $cookieStore.put('language', $scope.userCredentials.language);
        $scope.notifSuccess = 'true';
        $scope.notifDanger = 'false';
        $scope.notification = 'Your user information has been changed.';
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.changePwd = function () {
      resetProfileNotif();
      $scope.promise = ProfileService.changePwd($scope.passwordCredentials).success(function () {
        $scope.notifSuccess = 'true';
        $scope.notifDanger = 'false';
        $scope.notification = 'Your password has been changed.';
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.deleteProfile = function () {
      resetProfileNotif();
      $scope.promise = ProfileService.deleteProfile().success(function () {
        $rootScope.registrationNotif = 'Your profile has been deleted';
        SessionService.unset('authenticated');
        $cookieStore.remove('databaseId');
        $location.path('/');
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifSuccess = 'false';
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    $scope.logOut = function () {
      resetProfileNotif();
      AuthenticationService.logout().success(function () {
        $location.path('/');
        $cookieStore.remove('displayname');
        $cookieStore.remove('email');
        $cookieStore.remove('language');
        $cookieStore.remove('databaseId');
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
    function resetProfileNotif() {
      $scope.notifSuccess = undefined;
      $scope.notifDanger = undefined;
      $scope.notification = undefined;
    }
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:RegistrationCtrl
 * @description
 * # RegistrationCtrl
 * Controller of the kakaduSpaApp
 */
angular.module('kakaduSpaApp').controller('RegistrationCtrl', [
  '$scope',
  '$rootScope',
  '$location',
  'RegistrationService',
  function ($scope, $rootScope, $location, RegistrationService) {
    //$scope.credentials = { displayname: '', email: '', password: '', password_confirmation: ''};
    $scope.register = function () {
      //reset notification
      $scope.notifDanger = undefined;
      RegistrationService.register($scope.credentials).success(function () {
        $rootScope.registrationNotif = 'You are registered.';
        $location.path('/');
      }).error(function (data) {
        if (angular.isString(data.message)) {
          $scope.notifDanger = 'true';
          $scope.notification = data.message;
        } else {
          $location.path('/500');
        }
      });
    };
  }
]);
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function (a) {
  function f(a, b) {
    if (!(a.originalEvent.touches.length > 1)) {
      a.preventDefault();
      var c = a.originalEvent.changedTouches[0], d = document.createEvent('MouseEvents');
      d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d);
    }
  }
  if (a.support.touch = 'ontouchend' in document, a.support.touch) {
    var e, b = a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
    b._touchStart = function (a) {
      var b = this;
      !e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, 'mouseover'), f(a, 'mousemove'), f(a, 'mousedown'));
    }, b._touchMove = function (a) {
      e && (this._touchMoved = !0, f(a, 'mousemove'));
    }, b._touchEnd = function (a) {
      e && (f(a, 'mouseup'), f(a, 'mouseout'), this._touchMoved || f(a, 'click'), e = !1);
    }, b._mouseInit = function () {
      var b = this;
      b.element.bind({
        touchstart: a.proxy(b, '_touchStart'),
        touchmove: a.proxy(b, '_touchMove'),
        touchend: a.proxy(b, '_touchEnd')
      }), c.call(b);
    }, b._mouseDestroy = function () {
      var b = this;
      b.element.unbind({
        touchstart: a.proxy(b, '_touchStart'),
        touchmove: a.proxy(b, '_touchMove'),
        touchend: a.proxy(b, '_touchEnd')
      }), d.call(b);
    };
  }
}(jQuery);