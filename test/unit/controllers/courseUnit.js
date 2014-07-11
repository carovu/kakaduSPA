'use strict';

/*
* Unit tests for Courses controller
*/
describe('Unit test', function() {
  
  //need because using REST services
  beforeEach(function(){
    this.addMatchers({
      toEqualData: function(expected) {
        return angular.equals(this.actual, expected);
      }
    });
  });

  beforeEach(module('kakaduSpaApp'));
  beforeEach(module('kakaduSpaAppServices'));
  
  describe('CourseListCtrl', function() {
    var scope, ctrl, $httpBackend; 

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET('tmpJSONFiles_todelete/courses.json').
            respond([{name: 'General Knowledge'}, {name: 'Metropolises'}]);

        scope = $rootScope.$new();
        ctrl = $controller('CourseListCtrl', {$scope: scope});
    }));

    it('should create "courses" model with 2 courses fetched from xhr', function() {
      expect(scope.courses).toEqualData([]);
      $httpBackend.flush();

      expect(scope.courses).toEqualData([{name: 'General Knowledge'}, {name: 'Metropolises'}]);
    });

    it('should set the default value of orderProp model', function() {
      expect(scope.orderProp).toBe('age');
    });
  }); 

  describe('CourseQuestionCtrl', function(){
    var scope, ctrl, $httpBackend, 
    testData = function(){
      return{
        question: {id: '1', type: 'simple',question: 'test question', answer: 'test answer'}
      };
    };

    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('tmpJSONFiles_todelete/test.json').respond(testData());

      $routeParams.courseId = 'test';
      scope = $rootScope.$new();
      ctrl = $controller('CourseQuestionCtrl', {$scope: scope});
    }));

    it('should fetch course question view', function() {
      expect(scope.course).toEqualData({});
      $httpBackend.flush();

      expect(scope.course).toEqualData(testData());
    });
  });
});
