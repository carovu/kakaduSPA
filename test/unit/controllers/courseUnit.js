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
  
  it('should connect with Kakadu sucessfully',inject(function(CoursesService, $httpBackend) {
    $httpBackend.expect('GET', 'http://localhost/kakadu/public/api/spa/courses');
  }));

  describe('CourseListCtrl', function() {
  }); 

  describe('CourseQuestionCtrl', function(){
  });
});

/* Login unit test
it('should get login success',
  inject(function(LoginService, $httpBackend) {

    $httpBackend.expect('POST', 'https://api.mydomain.com/login')
      .respond(200, "[{ success : 'true', id : 123 }]");

    LoginService.login('test@test.com', 'password')
      .then(function(data) {
        expect(data.success).toBeTruthy();
    });

  $httpBackend.flush();
});
*/