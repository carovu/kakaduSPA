'use strict';

/*
*  Unit testing login
*/

describe('Controller: LoginCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var createLoginCtrl, scope, AuthenticationService, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    AuthenticationService = {
      'login': function(credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
      },
      'logout': function() {
        return $http.get('http://localhost/kakadu/public/api/spa/auth/logout');
      },
    };

    createLoginCtrl = function(){
      return $controller('LoginCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createLoginCtrl();
    expect(scope.credentials.email).toBe('');
    expect(scope.credentials.password).toBe('');  
    expect(scope.userCredentials.displayname).toBe('');  
    expect(scope.userCredentials.email).toBe('');  
    expect(scope.userCredentials.language).toBe('');  
  });  

  it('should exist', inject(function (AuthenticationService) {
    expect(AuthenticationService).toBeDefined();
  }));

  it('should call $http.post in login', inject(function (AuthenticationService, $httpBackend) {
    var credentials = { 
      email: 'caro@example.com', 
      password: 'password'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/auth/login', JSON.stringify(credentials));
    AuthenticationService.login(credentials);
  }));

  it('should call $http.get in logout', inject(function (AuthenticationService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/auth/logout');
    AuthenticationService.logout();
  }));
});
