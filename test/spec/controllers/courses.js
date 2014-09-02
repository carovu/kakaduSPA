'use strict';

/*
*  Unit testing courses
*/

describe('Controller: CourseListCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var createCourseListCtrl,scope, CoursesService, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    
    CoursesService = {
      'get': function(){
        return $http.get('http://localhost/kakadu/public/api/spa/courses');
      },
      'getPage': function(currentPage, perPage, sort, sortDir) {
        return $http.get('http://localhost/kakadu/public/api/spa/courses?page=20&per_page=20&sort=id&sort_dir=asc');
      },
      'search': function(searchInput) {
        return $http.get('http://localhost/kakadu/public/api/spa/courses/search?search=test');
      },
      'reset': function(courseId) {
        return $http.get('http://localhost/kakadu/public/api/spa/course/1/reset');
      }
    };

    createCourseListCtrl = function(){
      return $controller('CourseListCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createCourseListCtrl();
    expect(scope.orderProp).toBe('age');
    expect(scope.descript).toBe('false');  
    expect(scope.notifSuccess).toBe('false');  
    expect(scope.notifDanger).toBe('false');  
  });  

  it('should exist', inject(function (CoursesService) {
    expect(CoursesService).toBeDefined();
  }));

  it('should call $http.get in get', inject(function (CoursesService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/courses');
    CoursesService.get();
  }));

  it('should call $http.get in getPage', inject(function (CoursesService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/courses?page=20&per_page=20&sort=id&sort_dir=asc');
    CoursesService.getPage();
  }));

  it('should call $http.get in search', inject(function (CoursesService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/courses/search?search=test');
    CoursesService.search();
  }));

  it('should call $http.get in reset', inject(function (CoursesService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/course/1/reset');
    CoursesService.reset();
  }));
});

