'use strict';

/*
*  Unit testing coursequestions
*/

describe('Controller: CourseQuestionCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var CourseQuestionService, createCourseQuestionCtrl, scope, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    CourseQuestionService = {
      'getCourse': function(courseId) {
        return $http.get('http://localhost/kakadu/public/api/spa/course/'+ courseId +'/learning');
      },
      'getLearnFavorites': function(courseId) {
        return $http.get('http://localhost/kakadu/public/api/spa/favorites/learning');
      },
      'nextQuestion': function(questionmodel) {
        return $http.post('http://localhost/kakadu/public/api/spa/learning/next', questionmodel);
      }
    };

    createCourseQuestionCtrl = function(){
      return $controller('CourseQuestionCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createCourseQuestionCtrl();
  });  

  it('should exist', inject(function (CourseQuestionService) {
    expect(CourseQuestionService).toBeDefined();
  }));

  it('should call $http.get in getCourse', inject(function (CourseQuestionService, $httpBackend) {
    var courseId = 1;
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/course/'+ courseId +'/learning');
    CourseQuestionService.getCourse(courseId);
  }));

  it('should call $http.get in getLearnFavorites', inject(function (CourseQuestionService, $httpBackend) {
    var courseId = 1;
    $httpBackend.expectGET('http://localhost/kakadu/public/api/favorites/learning');
    CourseQuestionService.getLearnFavorites();
  }));

  it('should call $http.post in nextQuestion', inject(function (CourseQuestionService, $httpBackend) {
    var questionmodel = { 
          question: '1', 
          course: '1', 
          catalog: '1', 
          section: 'course', 
          answer: 'false'
        };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/learning/next', questionmodel);
    CourseQuestionService.nextQuestion(questionmodel);
  }));
});
