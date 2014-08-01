'use strict';

/*
*  All unit tests
*/
describe('Unit test', function() {
  var SessionService;
  var MultipleQuestionService;
  beforeEach(angular.mock.module('kakaduSpaApp'));
  beforeEach(inject(function(_SessionService_) {
     SessionService = _SessionService_;   
     spyOn(SessionService,'set').andCallThrough();
  }));
  beforeEach(inject(function(_MultipleQuestionService_) {
     MultipleQuestionService = _MultipleQuestionService_;   
  }));
  //testing routes
  //
  it('should map routes to controllers', function() {
    inject(function($route) {
      
      expect($route.routes['/'].templateUrl).toEqual('views/login.html');
      expect($route.routes['/'].controller).toBe('LoginCtrl');
      

      expect($route.routes['/courses'].templateUrl).toEqual('views/courses.html');
      expect($route.routes['/courses'].controller).toEqual('CourseListCtrl');

      expect($route.routes['/course/:courseId/learning'].templateUrl).toEqual('views/coursequestion.html');
      expect($route.routes['/course/:courseId/learning'].controller).toEqual('CourseQuestionCtrl');

      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });
  //testing sessionservice
  //
  it('should be able to set the storage through SessionService',function(){
      SessionService.set('authenticated', true);
      expect(SessionService.set).toHaveBeenCalledWith('authenticated', true);
  });

  //testing rightquestion
  //
  it('should give us the right answers from choices array through MultipleQuestionService',function(){
    var choices=['alpha', 'beta', 'gamma'];
    var answer=['1', '2']
      expect(MultipleQuestionService.getAnswers(choices, answer)).toEqual([ 'beta', 'gamma' ]);
  });
});
