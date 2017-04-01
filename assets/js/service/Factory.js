/**
 * Created by paritosh on 01/04/17.
 */


autoApp.service('Factory', ['$http','$q', function($http, $q) {
  return {
    'getStatusForDriver': function(input) {
      var defer = $q.defer();
      $http.post('/get-status-for-driver',input).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'getAllRequests': function(todo) {
      var defer = $q.defer();
      $http.get('/get-all-requests').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'acceptRequest': function(input) {
      var defer = $q.defer();
      $http.post('/accept-request', input).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'createRequest': function(input) {
      var defer = $q.defer();
      $http.post('/create-request', input).success(function(resp){
        console.log(resp);
        defer.resolve(resp);
      }).error( function(err) {
        console.log(err);
        defer.reject(err);
      });
      return defer.promise;
    }
  }
}]);
