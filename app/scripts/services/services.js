'use strict';

/**
 * Services
 * It represents our RESTful client. We can make requests to the server for data in an easier way,
 * without having to deal with the lower-leve $http API, HTTP methods and URLs.
 */

var kakaduServices = angular.module('kakaduSpaAppServices', ['ngResource']);

kakaduServices.factory('User', ['$resource',
  function($resource){
    return $resource('tmpJSONFiles_todelete/:userId.json', {}, {
      query: {method:'GET', params:{userId:'users'}, isArray:true}
    });
  }]);

kakaduServices.factory('Course', ['$resource',
  function($resource){
    return $resource('tmpJSONFiles_todelete/:courseId.json', {}, {
      query: {method:'GET', params:{courseId:'courses'}, isArray:true}
    });
  }]);

kakaduServices.factory('Question', ['$resource',
  function($resource){
    return $resource('tmpJSONFiles_todelete/:questionId.json', {}, {
      query: {method:'GET', params:{questionId:'questions'}, isArray:true}
    });
  }]);

