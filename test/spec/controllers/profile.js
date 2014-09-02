'use strict';

/*
*  Unit testing profile
*/

describe('Controller: ProfileCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var createProfileCtrl, scope, ProfileService, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    ProfileService = {
      'editUser': function(credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/edit', JSON.stringify(credentials));
      },
      'changePwd': function(credentials) {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/changepassword', JSON.stringify(credentials));
      },
      'deleteProfile': function() {
        return $http.post('http://localhost/kakadu/public/api/spa/profile/delete');
      }
    };

    createProfileCtrl = function(){
      return $controller('ProfileCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createProfileCtrl();
  });  

  it('should exist', inject(function (ProfileService) {
    expect(ProfileService).toBeDefined();
  }));

  it('should call $http.post in editUser', inject(function (ProfileService, $httpBackend) {
    var userCredentials = { 
      displayname: 'Caro', 
      email: 'car@example.com', 
      language: 'en'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/profile/edit', JSON.stringify(userCredentials));
    ProfileService.editUser(userCredentials);
  }));

  it('should call $http.post in changePwd', inject(function (ProfileService, $httpBackend) {
    var passwordCredentials = { 
      password_old: 'old_password', 
      password: 'new_password', 
      password_confirmation:'new_password'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/profile/changepassword', JSON.stringify(passwordCredentials));
    ProfileService.changePwd(passwordCredentials);
  }));

  it('should call $http.post in deleteProfile', inject(function (ProfileService, $httpBackend) {
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/profile/delete');
    ProfileService.deleteProfile();
  }));
});
