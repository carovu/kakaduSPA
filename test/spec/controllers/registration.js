'use strict';

/*
*  Unit testing registration
*/

describe('Controller: RegistrationCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var createRegistrationCtrl, scope, RegistrationService, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    RegistrationService = {
      'register': function(credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/auth/register', JSON.stringify(credentials));
      }
    };

    createRegistrationCtrl = function(){
      return $controller('RegistrationCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createRegistrationCtrl();
  });  

  it('should exist', inject(function (RegistrationService) {
    expect(RegistrationService).toBeDefined();
  }));

  it('should call $http.post in register', inject(function (RegistrationService, $httpBackend) {
    var credentials = { 
      displayname: 'Caro', 
      email: 'caro@example.com', 
      password: 'password', 
      password_confirmation: 'password'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/auth/register', JSON.stringify(credentials));
    RegistrationService.register(credentials);
  }));
  
});
