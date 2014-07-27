"use strict";var kakaduSpaApp=angular.module("kakaduSpaApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngDragDrop","kakaduSpaAppServices"]);kakaduSpaApp.config(["$routeProvider","$httpProvider",function(a,b){b.defaults.withCredentials=!0,a.when("/",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/courses",{templateUrl:"views/courses.html",controller:"CourseListCtrl"}).when("/course/:courseId/learning",{templateUrl:"views/coursequestion.html",controller:"CourseQuestionCtrl"}).otherwise({redirectTo:"/"})}]),kakaduSpaApp.run(["$rootScope","$location","$http","TokenService","AuthenticationService",function(a,b,c,d,e){d.get().success(function(a){c.defaults.headers.post["X-CSRF-Token"]=angular.fromJson(a)}).error(function(a,b){console.log("error data:"),console.log(a),console.log("error config:"),console.log(b)});var f=["/courses"];a.$on("$routeChangeStart",function(){window._(f).contains(b.path())&&!e.isLoggedIn()&&(b.path("/login"),console.log("Please log in to continue."))})}]);var kakaduServices=angular.module("kakaduSpaAppServices",["ngResource"]);kakaduServices.factory("TokenService",["$http",function(a){return{get:function(){return a.get("http://dbis-fw.uibk.ac.at:6680/api/spa/token")}}}]),kakaduServices.factory("CoursesService",["$http",function(a){return{get:function(){return a.get("http://dbis-fw.uibk.ac.at:6680/api/spa/courses")}}}]),kakaduServices.factory("SessionService",function(){return{get:function(a){return sessionStorage.getItem(a)},set:function(a,b){return sessionStorage.setItem(a,b)},unset:function(a){return sessionStorage.removeItem(a)}}}),kakaduServices.factory("AuthenticationService",["$http","$sanitize","SessionService",function(a,b,c){var d=function(){c.set("authenticated",!0)},e=function(){c.unset("authenticated")};return{login:function(b){var c=a.post("http://dbis-fw.uibk.ac.at:6680/api/spa/auth/login",JSON.stringify(b));return c.success(d),c},logout:function(){var b=a.get("http://dbis-fw.uibk.ac.at:6680/api/spa/auth/logout");return b.success(e),b},isLoggedIn:function(){return c.get("authenticated")}}}]),kakaduServices.factory("MultipleQuestion",function(){return{getAnswers:function(a,b){var c=[];return angular.forEach(b,function(b){c.push(a[b])}),c}}}),angular.module("kakaduSpaApp").controller("LoginCtrl",["$scope","$location","AuthenticationService",function(a,b,c){a.credentials={email:"",password:""},a.login=function(){c.login(a.credentials).success(function(){b.path("/courses")}).error(function(a,b){console.log("error data:"),console.log(a),console.log("error config:"),console.log(b)})}}]),angular.module("kakaduSpaApp").controller("CourseListCtrl",["$scope","$location","AuthenticationService","CoursesService",function(a,b,c,d){d.get().success(function(b){a.courses=b}),a.orderProp="age",a.logOut=function(){c.logout().success(function(){b.path("/")}).error(function(a,b){console.log("error data:"),console.log(a),console.log("error config:"),console.log(b)})}}]),angular.module("kakaduSpaApp").controller("CourseQuestionCtrl",["$scope","$routeParams","$http","$location","AuthenticationService","MultipleQuestion",function(a,b,c,d,e,f){c.get("http://dbis-fw.uibk.ac.at:6680/api/spa/course/"+b.courseId+"/learning").success(function(g){if(a.question=g,a.checkAnswer="false",a.showSimpleAnswer="false",a.simpleAnswered="false",a.chosenChoisesMultiple=[],a.question.choices&&"multiple"===a.question.type&&(a.rightAnswersMultiple=f.getAnswers(a.question.choices,a.question.answer)),a.showCheckMultiple="true",a.showNextMultiple="false",a.chooseButtonMultiple=[],a.choiceDrop="",a.setUpCloze=[],a.answeredCloze=[],a.showCheckCloze="true","cloze"===a.question.type){var h=a.question.question.split(a.question.answer[0]),i=[],j=h.length-1;angular.forEach(a.question.answer,function(b){j=h.length-1,b===a.question.answer[0]||(i=h[j].split(b),h.splice(j,1),h=h.concat(i))}),a.setUpCloze=h}a.nextQuestion=function(){a.questionmodel={question:a.question.id,course:a.question.course,catalog:a.question.catalog,section:"course",answer:"false"},console.log("You answered: "+a.checkAnswer),c.post("http://dbis-fw.uibk.ac.at:6680/api/spa/learning/next",a.questionmodel).success(function(b){a.question=b,a.checkAnswer="false",a.showSimpleAnswer="false",a.simpleAnswered="false",a.chosenChoisesMultiple=[],a.question.choices&&"multiple"===a.question.type&&(a.rightAnswersMultiple=f.getAnswers(a.question.choices,a.question.answer)),a.showCheckMultiple="true",a.showNextMultiple="false",a.chooseButtonMultiple=[],a.choiceDrop="",console.log(b)}).error(function(a,b){d.path("/"),console.log("error data:"),console.log(a),console.log("error config:"),console.log(b)})},a.logOut=function(){e.logout().success(function(){}).error(function(a,c){d.path("/course/"+b.courseId+"/learning"),console.log("error data:"),console.log(a),console.log("error config:"),console.log(c)})},a.showSimple=function(){a.showSimpleAnswer="true",a.simpleAnswered="true"},a.simpleAnswerCorrect=function(){a.checkAnswer="true",a.simpleAnswered="false"},a.simpleAnswerWrong=function(){a.checkAnswer="false",a.simpleAnswered="false"},a.chooseChoiceMultiple=function(b,c){a.chooseButtonMultiple[c]={"background-color":"orange"},-1===a.chosenChoisesMultiple.indexOf(b)&&a.chosenChoisesMultiple.push(b)},a.checkMultiple=function(){var b=0;a.showCheckMultiple="false",a.showNextMultiple="true",0===a.chosenChoisesMultiple.length&&b++,angular.forEach(a.chosenChoisesMultiple,function(c){-1===a.rightAnswersMultiple.indexOf(c)&&b++}),0===b&&(a.checkAnswer="true"),angular.forEach(a.question.answer,function(b){a.chooseButtonMultiple[b]={"background-color":"#dff0d8"}})},a.dropCallback=function(b,c,d){a.question.answer===d&&(a.checkAnswer="true")},a.checkCloze=function(){console.log("no idea how to check yet")}}).error(function(a,b){d.path("/"),console.log("Have you logged in?"),console.log("error data:"),console.log(a),console.log("error config:"),console.log(b)})}]);