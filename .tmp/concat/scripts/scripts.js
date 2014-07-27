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
kakaduServices.factory('MultipleQuestion', function () {
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
  'MultipleQuestion',
  function ($scope, $routeParams, $http, $location, AuthenticationService, MultipleQuestion) {
    $http.get('http://dbis-fw.uibk.ac.at:6680/api/spa/course/' + $routeParams.courseId + '/learning').success(function (data) {
      $scope.question = data;
      //global variable, is the check variable for all questiontypes
      $scope.checkAnswer = 'false';
      //check variable, wheter user answered question right or wrong
      //init for simplequesiton
      $scope.showSimpleAnswer = 'false';
      $scope.simpleAnswered = 'false';
      //hide button after checking answer
      //init for multiplequestion
      $scope.chosenChoisesMultiple = [];
      //fill rightanswersmultiple array with the right answers
      if ($scope.question.choices && $scope.question.type === 'multiple') {
        $scope.rightAnswersMultiple = MultipleQuestion.getAnswers($scope.question.choices, $scope.question.answer);
      }
      //hide check button
      $scope.showCheckMultiple = 'true';
      //show next button
      $scope.showNextMultiple = 'false';
      //number, of which choice field is clicked
      $scope.chooseButtonMultiple = [];
      //init for dragdropquestion
      $scope.choiceDrop = '';
      //init for clozequestion
      $scope.setUpCloze = [];
      $scope.answeredCloze = [];
      $scope.showCheckCloze = 'true';
      //setup of cloze question, does not work if the answer is not unique
      if ($scope.question.type === 'cloze') {
        //split question into array with two elements, where the answer is taken out.
        var iteration = $scope.question.question.split($scope.question.answer[0]);
        var tmp = [];
        var lastElement = iteration.length - 1;
        //iterate through the answers to split the question at the answer
        angular.forEach($scope.question.answer, function (answer) {
          lastElement = iteration.length - 1;
          //skip first element, because we already used and splitted it
          if (answer === $scope.question.answer[0]) {
          } else {
            //split question into array with two elements, where the answer is taken out.
            tmp = iteration[lastElement].split(answer);
            iteration.splice(lastElement, 1);
            iteration = iteration.concat(tmp);
          }
        });
        $scope.setUpCloze = iteration;
      }
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
        console.log('You answered: ' + $scope.checkAnswer);
        $http.post('http://dbis-fw.uibk.ac.at:6680/api/spa/learning/next', $scope.questionmodel).success(function (data) {
          $scope.question = data;
          //global variable, is the check variable for all questiontypes
          $scope.checkAnswer = 'false';
          //check variable, wheter user answered question right or wrong
          //init for simplequesiton
          $scope.showSimpleAnswer = 'false';
          $scope.simpleAnswered = 'false';
          //hide button after checking answer
          //init for multiplequestion
          $scope.chosenChoisesMultiple = [];
          //fill rightanswersmultiple array with the right answers
          if ($scope.question.choices && $scope.question.type === 'multiple') {
            $scope.rightAnswersMultiple = MultipleQuestion.getAnswers($scope.question.choices, $scope.question.answer);
          }
          //hide check button
          $scope.showCheckMultiple = 'true';
          //show next button
          $scope.showNextMultiple = 'false';
          //number, of which choice field is clicked
          $scope.chooseButtonMultiple = [];
          //init for dragdropquestion
          $scope.choiceDrop = '';
          //init for clozequestion
          $scope.setUpCloze = [];
          $scope.answeredCloze = [];
          $scope.showCheckCloze = 'true';
          //setup of cloze question, does not work if the answer is not unique
          if ($scope.question.type === 'cloze') {
            //split question into array with two elements, where the answer is taken out.
            var iteration = $scope.question.question.split($scope.question.answer[0]);
            var tmp = [];
            var lastElement = iteration.length - 1;
            //iterate through the answers to split the question at the answer
            angular.forEach($scope.question.answer, function (answer) {
              lastElement = iteration.length - 1;
              //skip first element, because we already used and splitted it
              if (answer === $scope.question.answer[0]) {
              } else {
                //split question into array with two elements, where the answer is taken out.
                tmp = iteration[lastElement].split(answer);
                iteration.splice(lastElement, 1);
                iteration = iteration.concat(tmp);
              }
            });
            $scope.setUpCloze = iteration;
          }
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
      //functions to display the different questions
      /*
      * functions for simple questions
      */
      //show simple answer
      $scope.showSimple = function () {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true';  //show correct, wrong button in simple
      };
      //use did remember answer correctly 
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
      * functions for mutliple questions
      */
      //put chosen answers into array chosenChoisesMultiple. array is unique. cannot undo chosen choice. 
      //what is in array, remains in array
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
        //if there is even one wrong answer, it does not matter how many, 
        //correct answers he has, it will be counted as wrongly answered
        //setting false is unnecessary, because checkanswer is false by default
        if (wrongAnswered === 0) {
          $scope.checkAnswer = 'true';
        }
        //iterate through multiple answer array, answer is the item of array
        angular.forEach($scope.question.answer, function (answerNumber) {
          $scope.chooseButtonMultiple[answerNumber] = { 'background-color': '#dff0d8' };
        });
      };
      /*
      * functions for DragDrop questions
      */
      $scope.dropCallback = function (event, ui, choice) {
        if ($scope.question.answer === choice) {
          $scope.checkAnswer = 'true';
        }
      };
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
      /*
      * functions for cloze questions
      */
      $scope.checkCloze = function () {
        console.log('no idea how to check yet');
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