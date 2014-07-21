"use strict";var kakaduSpaApp=angular.module("kakaduSpaApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","kakaduSpaAppServices"]);kakaduSpaApp.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/courses",{templateUrl:"views/courses.html",controller:"CourseListCtrl"}).when("/courses/:courseId",{templateUrl:"views/course-question.html",controller:"CourseQuestionCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("kakaduSpaApp").controller("LoginCtrl",["$scope","User",function(a,b){a.users=b.query()}]),angular.module("kakaduSpaApp").controller("CourseListCtrl",["$scope","Course",function(a,b){a.courses=b.query(),a.orderProp="age"}]),angular.module("kakaduSpaApp").controller("CourseQuestionCtrl",["$scope","$routeParams","Course",function(a,b,c){a.course=c.get({courseId:b.courseId})}]);var kakaduServices=angular.module("kakaduSpaAppServices",["ngResource"]);kakaduServices.factory("User",["$resource",function(a){return a("tmpJSONFiles_todelete/:userId.json",{},{query:{method:"GET",params:{userId:"users"},isArray:!0}})}]),kakaduServices.factory("Course",["$resource",function(a){return a("tmpJSONFiles_todelete/:courseId.json",{},{query:{method:"GET",params:{courseId:"courses"},isArray:!0}})}]),kakaduServices.factory("Question",["$resource",function(a){return a("tmpJSONFiles_todelete/:questionId.json",{},{query:{method:"GET",params:{questionId:"questions"},isArray:!0}})}]);