'use strict';

/*
*  Unit testing routes and services without http call
*/
describe('Unit test: Routes and Services without http call', function() {
  var httpBackend;
  var SessionService, MultipleQuestionService, TokenService;
  
  beforeEach(angular.mock.module('kakaduSpaApp'));

  beforeEach(inject(function (_SessionService_, _MultipleQuestionService_, $httpBackend) {
    httpBackend = $httpBackend;

    SessionService = _SessionService_;   
    spyOn(SessionService,'set').andCallThrough();
    MultipleQuestionService = _MultipleQuestionService_;   

    TokenService = {
      get: function() {
        return $http.get('http://localhost/kakadu/public/api/spa/token');
      }
    }
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

      expect($route.routes['/registration'].templateUrl).toEqual('views/registration.html');
      expect($route.routes['/registration'].controller).toEqual('RegistrationCtrl');

      expect($route.routes['/profile'].templateUrl).toEqual('views/profile.html');
      expect($route.routes['/profile'].controller).toEqual('ProfileCtrl');
      // otherwise redirect to
      expect($route.routes[null].redirectTo).toEqual('/');
    });
  });

  /*
  *  testing services
  */
  it("services can be instantiated", function() {
    expect(SessionService).not.toBeNull();
    expect(MultipleQuestionService).not.toBeNull(); 
  });

  /*
  *  testing SessionService
  */
  it('should be able to set the storage through SessionService',function(){
      SessionService.set('authenticated', true);
      expect(SessionService.set).toHaveBeenCalledWith('authenticated', true);
  });

  /*
  *  testing MultipleQuestionService
  */
  it('should give us the right answers from choices array through MultipleQuestionService',function(){
    var choices=['alpha', 'beta', 'gamma'];
    var answer=['1', '2']
    expect(MultipleQuestionService.getAnswers(choices, answer)).toEqual([ 'beta', 'gamma' ]);
  });

  /*
  *  testing TokenService
  */
  it('should call $http.get in get', inject(function (TokenService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/token');
    TokenService.get();
  }));
});

