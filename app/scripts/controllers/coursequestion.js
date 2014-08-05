'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # CourseQuestionCtrl
 * # Controller for questions of chosen course
 */

angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', function($scope, $routeParams, $http, $location, AuthenticationService, CourseQuestionService, MultipleQuestionService) {
    CourseQuestionService.getCourse($routeParams.courseId).success(function(data) {
      //Global variables
      $scope.question = data;
      $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
      if($scope.question.percentage === 100){
        console.log('CONGRATULATIONS! Well done! You have learned all questions. You can go back to the other courses by clicking on kakadu or continue learning this course by remaining here.');
      }
      //variables for the different types
      if($scope.question.type === 'simple'){

        $scope.showSimpleAnswer = 'false';
        $scope.simpleAnswered = 'false'; // for correct, wrong and next button

      } else if($scope.question.type === 'multiple'){

        $scope.chosenChoisesMultiple = [];
        //fill rightAnswersMultiple array with the right answers
        if($scope.question.choices){
          $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
        }     
        $scope.showCheckMultiple = 'true'; //hide check button
        $scope.showNextMultiple = 'false'; //show next button
        $scope.chooseButtonMultiple = []; //number, of which choice field is clicked

      } else if($scope.question.type === 'dragdrop'){

        $scope.choiceDrop = ''; //dropped choice in answer field    

      } else if($scope.question.type === 'cloze'){

        $scope.answeredCloze = []; //contains answers of the gaps 
        $scope.numRightGaps = 0;  //number of correct answered gaps
        $scope.shuffledAnswers = shuffle($scope.question.answer); //shown answers
        $scope.showCheckCloze = 'true';
        $scope.showNextCloze = 'false';   
      }
      /*
      functions for simple questions
      */
      //show answer
      $scope.showSimple = function() {
        $scope.showSimpleAnswer = 'true';
        $scope.simpleAnswered = 'true'; //show correct, wrong button in simple
      };
      //user did remember answer correctly 
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
      functions for mutliple questions
      */
      //put chosen answers into array chosenChoisesMultiple. array is unique.
      //cannot undo. what is in array, remains in array
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

        //setting false is unnecessary, because checkanswer is false by default
        if(wrongAnswered === 0){
          $scope.checkAnswer = 'true';
        }

        //iterate through multiple answer array and change background of right answers
        angular.forEach($scope.question.answer, function(answerNumber){
          $scope.chooseButtonMultiple[answerNumber] = {'background-color':'#dff0d8'};
        });
      };

      /*
      functions for DragDrop questions
      */
      //drop event
      $scope.dropCallback = function(event, ui, choice) {
        if($scope.question.answer === choice){
          $scope.checkAnswer = 'true';
        }
      };

      /*
      * functions for cloze questions
      */
      //checking cloze, we are using jquery, because offered AJS directives are not useful enough
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

      /*
      Global functions
      */
      $scope.nextQuestion = function() {
        $scope.questionmodel = { 
          question: $scope.question.id, //changes after every request
          course: $scope.question.course, //must always remain the same
          catalog: $scope.question.catalog,	//changes after every request
          section: 'course', //in laravelclient is choice between learning from catalogsection or favoritesection and is given over view, backbone and javascript 
                             //-> since we only have a course section in this client, and no backbone or view to give over and then call from in postadd, 
                             //we will add it manually here
          answer: $scope.checkAnswer //if user answers question right or wrong
        };

        CourseQuestionService.nextQuestion($scope.questionmodel).success(function(data) {
          $scope.question = data;
          $scope.checkAnswer = 'false';
          if($scope.question.percentage === 100){
            console.log('CONGRATULATIONS! Well done! You have learned all questions. You can go back to the other courses by clicking on kakadu or continue learning this course by remaining here.');
          }
          if($scope.question.type === 'simple'){

            $scope.showSimpleAnswer = 'false';
            $scope.simpleAnswered = 'false'; 

          } else if($scope.question.type === 'multiple'){

            $scope.chosenChoisesMultiple = [];
            if($scope.question.choices){
              $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
            }     
            $scope.showCheckMultiple = 'true'; 
            $scope.showNextMultiple = 'false'; 
            $scope.chooseButtonMultiple = [];

          } else if($scope.question.type === 'dragdrop'){

            $scope.choiceDrop = '';

          } else if($scope.question.type === 'cloze'){

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
      
    }).error(function (data, config) {
      $location.path('/');
      console.log('Have you logged in?');
      console.log('error data:');
      console.log(data);
      console.log('error config:');
      console.log(config);
    });

    function shuffle(array) {
      var currentIndex = array.length,temporaryValue,randomIndex;
     
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
});

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