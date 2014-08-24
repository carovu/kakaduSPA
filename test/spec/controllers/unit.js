'use strict';

/*
*  All unit tests
*/
describe('Unit test', function() {
  var SessionService, MultipleQuestionService, TokenService, CoursesService, CourseQuestionService, FavoritesService, AuthenticationService;
  beforeEach(angular.mock.module('kakaduSpaApp'));
  beforeEach(inject(function(_SessionService_, _MultipleQuestionService_, _TokenService_, _CoursesService_, _CourseQuestionService_, _FavoritesService_, _AuthenticationService_) {
     SessionService = _SessionService_;   
     spyOn(SessionService,'set').andCallThrough();
     MultipleQuestionService = _MultipleQuestionService_;   
     TokenService = _TokenService_;
     CoursesService = _CoursesService_;
     CourseQuestionService = _CourseQuestionService_;
     FavoritesService = _FavoritesService_;
     AuthenticationService = _AuthenticationService_;
  }));

  /*
  testing routes
  */
  it('should map routes to controllers', function() {
    inject(function($route) {
      
      expect($route.routes['/'].templateUrl).toEqual('views/login.html');
      expect($route.routes['/'].controller).toBe('LoginCtrl');
      

      expect($route.routes['/courses'].templateUrl).toEqual('views/courses.html');
      expect($route.routes['/courses'].controller).toEqual('CourseListCtrl');

      expect($route.routes['/course/:courseId/learning'].templateUrl).toEqual('views/coursequestion.html');
      expect($route.routes['/course/:courseId/learning'].controller).toEqual('CourseQuestionCtrl');

      expect($route.routes['/favorites'].templateUrl).toEqual('views/favorites.html');
      expect($route.routes['/favorites'].controller).toEqual('FavoritesCtrl');
      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });

  /*
  testing services
  */
  it("services can be instantiated", function() {
    expect(SessionService).not.toBeNull();
    expect(MultipleQuestionService).not.toBeNull();
    expect(TokenService).not.toBeNull();
    expect(CoursesService).not.toBeNull();
    expect(CourseQuestionService).not.toBeNull();
    expect(FavoritesService).not.toBeNull();
    expect(AuthenticationService).not.toBeNull();    
  });

  /*
  testing sessionservice
  */
  it('should be able to set the storage through SessionService',function(){
      SessionService.set('authenticated', true);
      expect(SessionService.set).toHaveBeenCalledWith('authenticated', true);
  });

  /*
  testing rightquestion
  */
  it('should give us the right answers from choices array through MultipleQuestionService',function(){
    var choices=['alpha', 'beta', 'gamma'];
    var answer=['1', '2']
    expect(MultipleQuestionService.getAnswers(choices, answer)).toEqual([ 'beta', 'gamma' ]);
  });
});

