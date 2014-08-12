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
			var gap = '<input type="text" id="answeredCloze['+i+']" style="background-color:#ababab; border:none"></input>';
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
				var gap = '<input type="text" id="answeredCloze['+i+']" style="background-color:#ababab; border:none"></input>';
				question = before + gap + after;
			}
			element.html(question);
      	});
      }
    };
  });