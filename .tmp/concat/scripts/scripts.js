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
    }).otherwise({ redirectTo: '/' });
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
      },
      reset: function (courseId) {
        return $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/course/' + courseId + '/reset');
      }
    };
  }
]);
kakaduServices.factory('CourseQuestionService', [
  '$http',
  function ($http) {
    return {
      getCourse: function (courseId) {
        return $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/course/' + courseId + '/learning');
      },
      nextQuestion: function (questionmodel) {
        return $http.post('http://dbis-fw.uibk.ac.at:6680/api/spa/learning/next', questionmodel);
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
kakaduServices.factory('MultipleQuestionService', function () {
  return {
    getAnswers: function (choices, answer) {
      var rightAnswerMultiple = [];
      angular.forEach(answer, function (answerNumber) {
        rightAnswerMultiple.push(choices[answerNumber]);
      });
      return rightAnswerMultiple;
    }
  };
});
'use strict';
/**
 * @ngdoc directive
 * @name kakaduSpaApp.directive:directives
 * @description
 * # Custom directives of this app: contains directives for cloze
 */
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
        var gap = '<textarea id="answeredCloze[' + i + ']" class="span2" rows="1" style="resize:none"></textarea>';
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
          var gap = '<textarea id="answeredCloze[' + i + ']" class="span2" rows="1" style="resize:none"></textarea>';
          question = before + gap + after;
        }
        element.html(question);
      });
    }
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
  '$route',
  '$http',
  'AuthenticationService',
  'CoursesService',
  function ($scope, $location, $route, $http, AuthenticationService, CoursesService) {
    CoursesService.get().success(function (data) {
      $scope.courses = data;
    });
    $scope.orderProp = 'age';
    $scope.resetPercentage = function (courseId) {
      CoursesService.reset(courseId).success(function () {
        $route.reload();
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };
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
'use strict';
/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # CourseQuestionCtrl
 * # Controller for questions of chosen course
 */
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', [
  '$scope',
  '$routeParams',
  '$http',
  '$location',
  'AuthenticationService',
  'CourseQuestionService',
  'MultipleQuestionService',
  function ($scope, $routeParams, $http, $location, AuthenticationService, CourseQuestionService, MultipleQuestionService) {
    CourseQuestionService.getCourse($routeParams.courseId).success(function (data) {
      //Global variables
      $scope.question = data;
      $scope.checkAnswer = 'false';
      //check variable, wheter user answered question right or wrong
      if ($scope.question.percentage === 100) {
        console.log('CONGRATULATIONS! Well done! You have learned all questions. You can go back to the other courses by clicking on kakadu or continue learning this course by remaining here.');
      }
      //variables for the different types
      if ($scope.question.type === 'simple') {
        $scope.showSimpleAnswer = 'false';
        $scope.simpleAnswered = 'false';  // for correct, wrong and next button
      } else if ($scope.question.type === 'multiple') {
        $scope.chosenChoisesMultiple = [];
        //fill rightAnswersMultiple array with the right answers
        if ($scope.question.choices) {
          $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
        }
        $scope.showCheckMultiple = 'true';
        //hide check button
        $scope.showNextMultiple = 'false';
        //show next button
        $scope.chooseButtonMultiple = [];  //number, of which choice field is clicked
      } else if ($scope.question.type === 'dragdrop') {
        $scope.choiceDrop = '';  //dropped choice in answer field    
      } else if ($scope.question.type === 'cloze') {
        $scope.answeredCloze = [];
        //contains answers of the gaps 
        $scope.numRightGaps = 0;
        //number of correct answered gaps
        $scope.shuffledAnswers = shuffle($scope.question.answer);
        //shown answers
        $scope.showCheckCloze = 'true';
        $scope.showNextCloze = 'false';
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
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      //user did not remember answer correctly
      $scope.simpleAnswerWrong = function () {
        $scope.checkAnswer = 'false';
        $scope.simpleAnswered = 'false';  //hide correct, wrong button in simple after clicking on them
      };
      /*
      functions for mutliple questions
      */
      //put chosen answers into array chosenChoisesMultiple. array is unique.
      //cannot undo. what is in array, remains in array
      //field is number of field, so you know which field will change color, once it is clicked
      $scope.chooseChoiceMultiple = function (choice, field) {
        $scope.chooseButtonMultiple[field] = { 'background-color': 'orange' };
        //check for uniqeness
        if ($scope.chosenChoisesMultiple.indexOf(choice) === -1) {
          //push choice into array
          $scope.chosenChoisesMultiple.push(choice);
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
        }
        //iterate through multiple choice array, answer is the item of array
        angular.forEach($scope.chosenChoisesMultiple, function (choice) {
          if ($scope.rightAnswersMultiple.indexOf(choice) === -1) {
            wrongAnswered++;
          }
        });
        //setting false is unnecessary, because checkanswer is false by default
        if (wrongAnswered === 0) {
          $scope.checkAnswer = 'true';
        }
        //iterate through multiple answer array and change background of right answers
        angular.forEach($scope.question.answer, function (answerNumber) {
          $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
        });
      };
      /*
      functions for DragDrop questions
      */
      //drop event
      $scope.dropCallback = function (event, ui, choice) {
        if ($scope.question.answer === choice) {
          $scope.checkAnswer = 'true';
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
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#9acd32');
          } else {
            angular.element(document.getElementById('answeredCloze[' + i + ']').style.backgroundColor = '#FF6347');
          }
        });
        if ($scope.numRightGaps === $scope.question.answer.length) {
          $scope.checkAnswer = 'true';
        }
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
          if ($scope.question.percentage === 100) {
            console.log('CONGRATULATIONS! Well done! You have learned all questions. You can go back to the other courses by clicking on kakadu or continue learning this course by remaining here.');
          }
          if ($scope.question.type === 'simple') {
            $scope.showSimpleAnswer = 'false';
            $scope.simpleAnswered = 'false';
          } else if ($scope.question.type === 'multiple') {
            $scope.chosenChoisesMultiple = [];
            if ($scope.question.choices) {
              $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
            }
            $scope.showCheckMultiple = 'true';
            $scope.showNextMultiple = 'false';
            $scope.chooseButtonMultiple = [];
          } else if ($scope.question.type === 'dragdrop') {
            $scope.choiceDrop = '';
          } else if ($scope.question.type === 'cloze') {
            $scope.answeredCloze = [];
            $scope.numRightGaps = 0;
            $scope.shuffledAnswers = shuffle($scope.question.answer);
            $scope.showCheckCloze = 'true';
            $scope.showNextCloze = 'false';
          }
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
/*    Not needed dragdropUI functions, here, in case i will need it in the future
jqyoui-droppable="{onDrop:'dropCallback(choiceDrop)',onOver: 'overCallback', onOut: 'outCallback'}"
jqyoui-draggable="{placeholder:true,animate:true, onStart:'startCallback', onStop: 'stopCallback', onDrag: 'dragCallback'}"
      $scope.startCallback = function(event, ui) {

      };

      $scope.stopCallback = function(event, ui) {
        console.log('stopCallback');
      };

      $scope.dragCallback = function(event, ui) {
        console.log('dragCallback');
      };
      $scope.overCallback = function(event, ui) {
        console.log('overCallback');
      };

      $scope.outCallback = function(event, ui) {
        console.log('outCallback');
      };
*/
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