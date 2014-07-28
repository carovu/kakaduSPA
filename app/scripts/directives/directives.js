'use strict';

/**
 * @ngdoc directive
 * @name kakaduSpaApp.directive:directives1
 * @description
 * # directives1
 */
angular.module('kakaduSpaApp').directive('clozeQuestion', function () {
    return {
      restrict: 'E',
      require: '^ngModel',
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
			var gap = '<textarea id="answeredCloze['+i+']" class="span2" rows="1" style="resize:none"></textarea>';
			question = before + gap + after;
		}
		element.html(question);
      }
    };
  });
