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
      	//1. "@"   (  Text binding / one-way binding )
		//2. "="   ( Direct model binding / two-way binding )
		//3. "&"   ( Behaviour binding / Method binding  )
	  scope: {	//create isolated scope
	  	ngModel: '='
	  },
      link: function(scope, element) {
      	var question = scope.ngModel.question;
        var answers = scope.ngModel.answer;
		for(var i = 0; i < answers.length; i++){
			var startPos = question.search(answers[i]);
			var endPos = startPos + answers[i].length;
			var before = question.substr(0, startPos);
			var after = question.substr(endPos, question.length);
			var gap = '<input type="text" id="answeredCloze['+i+']" style="background-color:#ababab; border:none"></input> <label id="'+answers[i]+'" style="color:#3c763d"></label>';
			question = before + gap + after;
		}
		element.html(question);
		//so if after a cloze question, another cloze question comes, it will be updated
      	scope.$watch('ngModel', function(){
	        question = scope.ngModel.question;
	        answers = scope.ngModel.answer;
			for(var i = 0; i < answers.length; i++){
				var startPos = question.search(answers[i]);
				var endPos = startPos + answers[i].length;
				var before = question.substr(0, startPos);
				var after = question.substr(endPos, question.length);
				var gap = '<input type="text" id="answeredCloze['+i+']" style="background-color:#ababab; border:none"></input> <label id="'+answers[i]+'" style="color:#3c763d"></label>';
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
    	templateUrl:'views/directives/header.html'
    };
  });

//directive for header in index.html = when not logged in
angular.module('kakaduSpaApp').directive('headerIndex', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/index-header.html'
    };
  });

//directive for header, when logged in
angular.module('kakaduSpaApp').directive('footer', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/index-footer.html'
    };
  });

//directive for searching the courses in courses.html, searches courses in the whole database
angular.module('kakaduSpaApp').directive('search', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/courses-search.html'
    };
  });

//directive for the sorting button in courses(courses.html)
angular.module('kakaduSpaApp').directive('sorting', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/courses-sorting.html'
    };
  });

//directive for paginating the courses in courses.html
angular.module('kakaduSpaApp').directive('paginate', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/courses-pagination.html'
    };
  });

//directive for showing all courses
angular.module('kakaduSpaApp').directive('listCourses', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/courses-list.html'
    };
  });

//directive for searching the courses in favorites.html, searches favorites you have
angular.module('kakaduSpaApp').directive('searchSort', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/favorites-search-sort.html'
    };
  });

//directive for showing the favorites courses
angular.module('kakaduSpaApp').directive('listFavorites', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/favorites-list.html'
    };
  });

//directive for showing the progressbar
angular.module('kakaduSpaApp').directive('progressbar', function () {
    return {
     restrict: 'E',
     templateUrl:'views/directives/coursequestion-progressbar.html'
    };
  });

//directive for showing the questiontypes
angular.module('kakaduSpaApp').directive('questiontypes', function () {
    return {
    	restrict: 'E',
    	templateUrl:'views/directives/coursequestion-questiontypes.html'
    };
  });

