'use strict';

/**
 * @ngdoc function
 * @name kakaduSpaApp.controller:CourseQuestionCtrl
 * @description
 * # CourseQuestionCtrl
 * # Controller for questions of chosen course
 */

angular.module('kakaduSpaApp').controller('CourseQuestionCtrl', function ($rootScope, $scope, $routeParams, $http, $location, $cookieStore, AuthenticationService, CourseQuestionService, MultipleQuestionService) {
    $scope.delay = 0;
    $scope.minDuration = 0;
    $scope.message = 'Please Wait...';
    $scope.backdrop = true;
    $scope.promise = null;
    $scope.showStat = 'false';

    $scope.promise = CourseQuestionService.getCourse($routeParams.courseId).success(function(data) {
          //Global variables
          $scope.question = data;
          $scope.checkAnswer = 'false'; //check variable, wheter user answered question right or wrong
          $scope.message = '';  //notification, how you answered
          $scope.mSuccess = ''; //notification for correctly answered
          $scope.mFailure = ''; //notification for falsely answered
          $scope.notifSuccess = 'false';
          $scope.notifFailure = 'false';
          $scope.numCorrectPercentage = ($scope.question.numCorrect/$scope.question.numAnswered)*100;
          $scope.numIncorrectPercentage = ($scope.question.numIncorrect/$scope.question.numAnswered)*100;
          //variables for the different types
          if($scope.question.type === 'simple'){

            $scope.showSimpleAnswer = 'false';
            $scope.simpleAnswered = 'false'; // for correct, wrong and next button

          } else if($scope.question.type === 'multiple'){
            $scope.chosenChoisesMultiple = [];
            $scope.choicesFieldNum = []; //remembers the number of the chosen fields
            //fill rightAnswersMultiple array with the right answers
            if($scope.question.choices){
              $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
            }     
            $scope.showCheckMultiple = 'true'; //hide check button
            $scope.showNextMultiple = 'false'; //show next button
            $scope.showSolution = 'false'; //show solution button
            $scope.chooseButtonMultiple = []; //number, of which choice field is clicked
            $scope.shuffledChoices = shuffle($scope.question.choices); //shuffle choices
            $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple); //like question.answer, but for shuffled array

          } else if($scope.question.type === 'dragdrop'){

            $scope.choiceDrop = '';//dropped choice in answer field    
            $scope.shuffledChoices = shuffle($scope.question.choices);

          } else if($scope.question.type === 'cloze'){

            $scope.answeredCloze = []; //contains answers of the gaps 
            $scope.numRightGaps = 0;  //number of correct answered gaps
            $scope.showCheckCloze = 'true';
            $scope.showNextCloze = 'false';
            $scope.disableCloze = 0; //variable to disable input field or not
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
            $scope.notifSuccess = 'true';
            $scope.mSuccess = 'Your answer was correct.';
            $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
          };
          //user did not remember answer correctly
          $scope.simpleAnswerWrong = function() {
            $scope.checkAnswer = 'false';
            $scope.notifFailure = 'true';
            $scope.mFailure = 'Your answer was not correct';
            $scope.simpleAnswered = 'false';//hide correct, wrong button in simple after clicking on them
          };

          /*
          functions for mutliple questions
          */
          //put chosen answers into array chosenChoisesMultiple. array is unique.
          //cannot undo. what is in array, remains in array
          //field is number of field, so you know which field will change color, once it is clicked
          $scope.chooseChoiceMultiple = function(choice, field){
            if($scope.choicesFieldNum.indexOf(field) === -1){
                $scope.chooseButtonMultiple[field] = {'border-style': 'solid', 'border-width': 'thick'};
                $scope.choicesFieldNum.push(field);
                //check for uniqeness
                if($scope.chosenChoisesMultiple.indexOf(choice) === -1){
                  //push choice into array
                  $scope.chosenChoisesMultiple.push(choice);
                }
              }else{
                $scope.chooseButtonMultiple[field] = {'background-color':'white'};
                //delete your choice from fieldnumberarray
                for(var i = $scope.choicesFieldNum.length - 1; i >= 0; i--){
                    if($scope.choicesFieldNum[i] === field){
                        $scope.choicesFieldNum.splice(i,1);
                    }
                }
                //delete your choice from the chosenchoisesarray
                for(var x = $scope.chosenChoisesMultiple.length - 1; x >= 0; x--){
                    if($scope.chosenChoisesMultiple[x] === choice){
                        $scope.chosenChoisesMultiple.splice(x,1);
                    }
                }
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
                angular.forEach($scope.correctAnswerField, function(answerNumber){
                  $scope.chooseButtonMultiple[answerNumber] = {'background-color':'#dff0d8'};
                });
            }
            //iterate through multiple choice array, answer is the item of array
            angular.forEach($scope.chosenChoisesMultiple, function(choice, key){
              if($scope.chosenChoisesMultiple.length === $scope.rightAnswersMultiple.length){
                if($scope.rightAnswersMultiple.indexOf(choice) === -1){
                  wrongAnswered++;
                  $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {'background-color':'#f2dede', 'border-style': 'solid', 'border-width': 'thick'};
                }else{
                  $scope.chooseButtonMultiple[$scope.choicesFieldNum[key]] = {'background-color':'#dff0d8', 'border-style': 'solid', 'border-width': 'thick'};
                }
              }else{
                wrongAnswered++;
              }
            });

            //setting false is unnecessary, because checkanswer is false by default
            if(wrongAnswered === 0){
              $scope.checkAnswer = 'true';
              $scope.notifSuccess = 'true';
              $scope.mSuccess = 'Your answer was correct.';
            }else{
              if($scope.chosenChoisesMultiple.length === 0){
                $scope.notifFailure = 'true';
                $scope.mFailure = 'Your answer was not correct';
              }else{
                $scope.showSolution = 'true';
                $scope.notifFailure = 'true';
                $scope.mFailure = 'Your answer was not correct';
              }
            }
          };

          $scope.showCorrectAnswers = function() {
            $scope.showSolution = 'false';
            angular.forEach($scope.correctAnswerField, function(answerNumber){
              $scope.chooseButtonMultiple[answerNumber] = {'background-color':'#dff0d8'};
            });
          };

          /*
          functions for DragDrop questions
          */
          //drop event
          $scope.dropCallback = function(event, ui, choice) {
            $scope.mSuccess = 'You answered correct.';
            //angular.element(ui.draggable).scope().choiceDrop
            if($scope.question.answer === choice){
              $scope.checkAnswer = 'true';
              $scope.notifSuccess = 'true';
              $scope.notifFailure = 'false';
              $scope.mSuccess = 'Your answer was correct.';
            }else{
              $scope.notifSuccess = 'false';
              $scope.notifFailure = 'true';
              $scope.mFailure = 'Your answer was not correct';
            }
          };

          //hide or show draggable
          $scope.showDraggable = function(content) {
            //is a choice
            if($scope.question.choices.indexOf(content) !== -1){
              return true;
            } else{
              return false;
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
                angular.element(document.getElementById('answeredCloze['+i+']').style.backgroundColor = '#dff0d8');
                angular.element(document.getElementById('answeredCloze['+i+']').style.borderColor = '#d6e9c6');
                angular.element(document.getElementById('answeredCloze['+i+']').style.color = '#3c763d');
              }else{
                angular.element(document.getElementById('answeredCloze['+i+']').style.backgroundColor = '#f2dede');
                angular.element(document.getElementById('answeredCloze['+i+']').style.borderColor = '#ebccd1');
                angular.element(document.getElementById('answeredCloze['+i+']').style.color = '#a94442');
                angular.element(document.getElementById(answer).innerHTML = answer);
              }
              angular.element(document.getElementById('answeredCloze['+i+']').setAttribute('disabled', true));
            });  
            if($scope.numRightGaps === $scope.question.answer.length){
              $scope.checkAnswer = 'true';
              $scope.notifSuccess = 'true';
              $scope.mSuccess = 'Your answer was correct.';
            }else{
              $scope.notifFailure = 'true';
              $scope.mFailure = 'Your answer was not correct';
            }
            $scope.disableCloze++;
          };

          /*
          Global functions
          */
          $scope.nextQuestion = function() {
            $scope.questionmodel = { 
              question: $scope.question.id, //changes after every request
              course: $scope.question.course, //must always remain the same
              catalog: $scope.question.catalog, //changes after every request
              section: 'course', //in laravelclient is choice between learning from catalogsection or favoritesection and is given over view, backbone and javascript 
                                 //-> since we only have a course section in this client, and no backbone or view to give over and then call from in postadd, 
                                 //we will add it manually here
              answer: $scope.checkAnswer //if user answers question right or wrong
            };
            CourseQuestionService.nextQuestion($scope.questionmodel).success(function (data) {
              $scope.question = data;
              $scope.checkAnswer = 'false';
              $scope.message = '';
              $scope.mSuccess = ''; 
              $scope.mFailure = ''; 
              $scope.notifSuccess = 'false';
              $scope.notifFailure = 'false';
              $scope.numCorrectPercentage = ($scope.question.numCorrect/$scope.question.numAnswered)*100;
              $scope.numIncorrectPercentage = ($scope.question.numIncorrect/$scope.question.numAnswered)*100;
              if($scope.question.type === 'simple'){

                $scope.showSimpleAnswer = 'false';
                $scope.simpleAnswered = 'false'; 

              } else if($scope.question.type === 'multiple'){

                $scope.chosenChoisesMultiple = [];
                $scope.choicesFieldNum = [];
                if($scope.question.choices){
                  $scope.rightAnswersMultiple = MultipleQuestionService.getAnswers($scope.question.choices, $scope.question.answer);
                }     
                $scope.showCheckMultiple = 'true'; 
                $scope.showNextMultiple = 'false'; 
                $scope.showSolution = 'false'; //show solution button
                $scope.chooseButtonMultiple = [];
                $scope.shuffledChoices = shuffle($scope.question.choices);
                $scope.correctAnswerField = MultipleQuestionService.getAnswerFields($scope.shuffledChoices, $scope.rightAnswersMultiple);

              } else if($scope.question.type === 'dragdrop'){

                //angular.element(document.getElementById('choiceDragDrop')).scope().choiceDrop = '';
                $scope.choiceDrop = '';
                $scope.shuffledChoices = shuffle($scope.question.choices);

              } else if($scope.question.type === 'cloze'){

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

          $scope.showStatistic = function() {
            if($scope.showStat === 'false'){
              $scope.showStat = 'true';
            } else{
              $scope.showStat = 'false';
            }
          };
          $scope.logOut = function() {
            AuthenticationService.logout().success(function() {
              $cookieStore.remove('displayname');
              $cookieStore.remove('email');
              $cookieStore.remove('language');
              $cookieStore.remove('databaseId');
            }).error(function (data) {
              $location.path('/course/'+$routeParams.courseId+'/learning');
              $rootScope.notifDanger = 'true';
              $rootScope.notification = data.message;
            });
          };
        }).error(function (data) {
          $location.path('/');
          $rootScope.notifDanger = 'true';
          $rootScope.notification = data.message+'. Have you logged in?' ;
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