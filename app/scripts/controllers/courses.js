'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseCtrl
 * @description
 * # Controller for List of Courses
 */
 
angular.module('kakaduSpaApp').controller('CourseListCtrl', function($scope, $location, AuthenticationService, CoursesService) {
    CoursesService.get().success(function(data) {
      $scope.courses = data;
    });

    $scope.orderProp = 'age';

    $scope.logOut = function() {
      AuthenticationService.logout().success(function() {
        $location.path('/');
      }).error(function (data, config) {
        console.log('error data:');
        console.log(data);
        console.log('error config:');
        console.log(config);
      });
    };
  });

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # Controller for questions of chosen course
*/
angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', function($scope, $routeParams, $http, $location, AuthenticationService, MultipleQuestionService) {
    $http.get('http://localhost/kakadu/public/api/spa/course/'+$routeParams.courseId+'/learning').success(function(data) {
      $scope.question = data;

      //global variable, is the check variable for all questiontypes
      $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
      
      //init for simplequesiton
      $scope.showSimpleAnswer = 'false';
      $scope.simpleAnswered = 'false'; //hide button after checking answer

      //init for multiplequestion
      $scope.chosenChoisesMultiple = [];
      //fill rightanswersmultiple array with the right answers
      if($scope.question.choices && $scope.question.type === 'multiple'){
        $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
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
      $scope.answeredCloze = [];
      $scope.numRightGaps = 0;
      $scope.showCheckCloze = 'true';
      $scope.showNextCloze = 'false';


      $scope.nextQuestion = function() {
        //course bleibt immer gleich, quesiton und catalog id ändert sich, 
        //answer ist, ob der user die question richtig oder falsch beantwortet hat
        $scope.questionmodel = { 
          question: $scope.question.id, 
          course: $scope.question.course, 
          catalog: $scope.question.catalog,  
          section: 'course', //in laravelclient is choice between learning from catalogsection or favoritesection and is given over view, backbone and javascript 
                             //-> since we only have a course section in this client, and no backbone or view to give over and then call from in postadd, 
                             //we will add it manually here
          answer: 'false'
        };
        console.log('You answered: ' + $scope.checkAnswer);
        $http.post('http://localhost/kakadu/public/api/spa/learning/next', $scope.questionmodel).success(function(data) {
          $scope.question = data;

          //global variable, is the check variable for all questiontypes
          $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
          
          //init for simplequesiton
          $scope.showSimpleAnswer = 'false';
          $scope.simpleAnswered = 'false'; //hide button after checking answer

          //init for multiplequestion
          $scope.chosenChoisesMultiple = [];
          //fill rightanswersmultiple array with the right answers
          if($scope.question.choices && $scope.question.type === 'multiple'){
            $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
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
          $scope.answeredCloze = [];
          $scope.numRightGaps = 0;
          $scope.showCheckCloze = 'true';
          $scope.showNextCloze = 'false';
          
          console.log(data);
        }).error(function (data, config) {
          $location.path('/');
          console.log('error data:');
          console.log(data);
          console.log('error config:');
          console.log(config);
        });
      };

      $scope.logOut = function() {
        AuthenticationService.logout().success(function() {
        }).error(function (data, config) {
          $location.path('/course/'+$routeParams.courseId+'/learning');
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
      $scope.showSimple = function() {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true'; //show correct, wrong button in simple
      };

      //use did remember answer correctly 
      $scope.simpleAnswerCorrect = function() {
        $scope.checkAnswer = 'true';
        $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
      };
      
      //user did not remember answer correctly
      $scope.simpleAnswerWrong = function() {
        $scope.checkAnswer = 'false';
        $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
      };

      /*
      * functions for mutliple questions
      */

      //put chosen answers into array chosenChoisesMultiple. array is unique. cannot undo chosen choice. 
      //what is in array, remains in array
      //field is number of field, so you know which field will change color, once it is clicked
      $scope.chooseChoiceMultiple = function(choice, field){
        $scope.chooseButtonMultiple[field] = {'background-color':'orange'};
        //check for uniqeness
        if($scope.chosenChoisesMultiple.indexOf(choice) === -1){
          //push choice into array
          $scope.chosenChoisesMultiple.push(choice);
        }
      };

      //check the chosen answers with solutionanswer
      //every choice has to be right, otherwise, answered wrong.
      //there is no halfright or halfwrong
      $scope.checkMultiple = function(){
        var wrongAnswered = 0;
        $scope.showCheckMultiple = 'false';
        $scope.showNextMultiple = 'true';
        //in case you skip question and choose nothing, will be counted as a wrong answer
        if($scope.chosenChoisesMultiple.length === 0){
            wrongAnswered++;
        }  
        //iterate through multiple choice array, answer is the item of array
        angular.forEach($scope.chosenChoisesMultiple, function(choice){
          if($scope.rightAnswersMultiple.indexOf(choice) === -1){
            wrongAnswered++;
          }
        });

        //if there is even one wrong answer, it does not matter how many, 
        //correct answers he has, it will be counted as wrongly answered
        //setting false is unnecessary, because checkanswer is false by default
        if(wrongAnswered === 0){
          $scope.checkAnswer = 'true';
        }

        //iterate through multiple answer array, answer is the item of array
        angular.forEach($scope.question.answer, function(answerNumber){
          $scope.chooseButtonMultiple[answerNumber] = {'background-color':'#dff0d8'};
        });
      };


      /*
      * functions for DragDrop questions
      */
      $scope.dropCallback = function(event, ui, choice) {
        if($scope.question.answer === choice){
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
      $scope.checkCloze = function(){
        $scope.showCheckCloze = 'false';
        $scope.showNextCloze = 'true';
        angular.forEach($scope.question.answer, function(answer, i){
          if(angular.lowercase(angular.element(document.getElementById('answeredCloze['+i+']')).val()) === angular.lowercase(answer)){
            $scope.numRightGaps++;
            angular.element(document.getElementById('answeredCloze['+i+']').style.backgroundColor = '#9acd32');
          }else{
            angular.element(document.getElementById('answeredCloze['+i+']').style.backgroundColor = '#FF6347');
          }
        });  
        if($scope.numRightGaps === $scope.question.answer.length){
          $scope.checkAnswer = 'true';
        }
      };

    }).error(function (data, config) {
      $location.path('/');
      console.log('Have you logged in?');
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });
});
    
