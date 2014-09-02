'use strict';

/*
*  Unit testing favorites
*/

describe('Controller: FavoritesCtrl', function () {

  // load the controller's module
  beforeEach(module('kakaduSpaApp'));

  var createFavoritesCtrl, scope, FavoritesService, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;

    FavoritesService = {
      'getFavorites': function() {
        return $http.get('http://localhost/kakadu/public/api/spa/favorites');
      },
      'add': function(data) {
        return $http.post('http://localhost/kakadu/public/api/spa/favorites/add', data);
      },
      'remove': function(data) {
        return $http.post('http://localhost/kakadu/public/api/spa/favorites/remove', data);
      }
    };

    createFavoritesCtrl = function(){
      return $controller('FavoritesCtrl', {$scope: scope, $http: $httpBackend});
    };
  }));

  it('initial values should be correct', function () {
    createFavoritesCtrl();
    expect(scope.notifInfo).toBe('false');  
    expect(scope.notifDanger).toBe('false');  
  });  

  it('should exist', inject(function (FavoritesService) {
    expect(FavoritesService).toBeDefined();
  }));

  it('should call $http.get in getFavorites', inject(function (FavoritesService, $httpBackend) {
    $httpBackend.expectGET('http://localhost/kakadu/public/api/spa/favorites');
    FavoritesService.getFavorites();
  }));

  it('should call $http.post in add', inject(function (FavoritesService, $httpBackend) {
    var data = { 
      id: '1',
      type: 'course'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/favorites/add', data);
    FavoritesService.add(data);
  }));

  it('should call $http.get in remove', inject(function (FavoritesService, $httpBackend) {
    var data = { 
      id: '1',
      type: 'course'
    };
    $httpBackend.expectPOST('http://localhost/kakadu/public/api/spa/favorites/remove', data);
    FavoritesService.remove(data);
  }));

});
