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
kakaduServices.factory('MultipleQuestionService', function() {
  return {
    getAnswers: function(choices, answer) {
      var rightAnswerMultiple = [];
      angular.forEach(answer, function(answerNumber){
        rightAnswerMultiple.push(choices[answerNumber]);
      });
      return rightAnswerMultiple;
    },
    getAnswerFields: function(shuffledChoices, CorrectAnswer) {
      var rightAnswerMultipleField = [];
      angular.forEach(shuffledChoices, function(choice, index){
        if(CorrectAnswer.indexOf(choice) !== -1){
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
kakaduServices.factory('SessionService', function() {
  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val); 
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  };
});

/**
 * Service to get csrf token from server
 */
kakaduServices.factory('TokenService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/token');
    }
  };
});

/**
 * Service to get requests concerning courses from server
 */
kakaduServices.factory('CoursesService', function($http) {
  return {
    get: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/courses');
    },
    getPage: function(currentPage, perPage, sort, sortDir) {
      return $http.get('http://localhost/kakadu/public/api/spa/courses?page='+currentPage+'&per_page='+perPage+'&sort='+sort+'&sort_dir='+sortDir);
    },
    search: function(searchInput) {
      return $http.get('http://localhost/kakadu/public/api/spa/courses/search?search='+searchInput);
    }
  };
});

/**
 * Service to get requests concerning the quiz from server
 */
kakaduServices.factory('CourseQuestionService', function($http) {
  return {
    getCourse: function(courseId) {
      return $http.get('http://localhost/kakadu/public/api/spa/course/'+ courseId +'/learning');
    },
    getLearnFavorites: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/favorites/learning');
    },
    nextQuestion: function(questionmodel) {
      return $http.post('http://localhost/kakadu/public/api/spa/learning/next', questionmodel);
    }
  };
});

/**
 * Service to get requests concerning the favorites from server
 */
kakaduServices.factory('FavoritesService', function($http) {
  return {
    getFavorites: function() {
      return $http.get('http://localhost/kakadu/public/api/spa/favorites');
    },
    add: function(data) {
      return $http.post('http://localhost/kakadu/public/api/spa/favorites/add', data);
    },
    remove: function(data) {
      return $http.post('http://localhost/kakadu/public/api/spa/favorites/remove', data);
    }
  };
});


/**
 * Service to get requests concerning authentification from server
 */
kakaduServices.factory('AuthenticationService', function($http,  $sanitize, SessionService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  return {
    login: function(credentials) {
      var login = $http.post('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
      login.success(cacheSession);
      return login;
    },
    logout: function() {
      var logout = $http.get('http://localhost/kakadu/public/api/spa/auth/logout');
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };
});

/**
 * Service to get requests concerning profile from server
 */
kakaduServices.factory('ProfileService', function($http) {
  return {
    editUser: function(credentials) {
      return $http.post('http://localhost/kakadu/public/api/spa/profile/edit', JSON.stringify(credentials));
    },
    changePwd: function(credentials) {
      return $http.post('http://localhost/kakadu/public/api/spa/profile/changepassword', JSON.stringify(credentials));
    },
    deleteProfile: function() {
      return $http.post('http://localhost/kakadu/public/api/spa/profile/delete');
    }
  };
});

/**
 * Service to get requests concerning registration from server
 */
kakaduServices.factory('RegistrationService', function($http) {
  return {
    register: function(credentials) {
      return $http.post('http://localhost/kakadu/public/api/spa/auth/register', JSON.stringify(credentials));
    }
  };
});
