/**
 * Created by paritosh on 01/04/17.
 */

autoApp.controller('DashboardCtrl', ['$scope', '$rootScope', '$location', 'Factory',
  function($scope, $rootScope, $location, Factory) {

    $scope.getAllRequests = function () {
      Factory.getAllRequests().then(function(response) {
        if(response.status == 'success') {
          $scope.requests = response.data;
        }
        else{
          $scope.failMessage = response.data;
        }
      });
    };

    $scope.getElapsedTime = function (time) {
      if(time){
        return moment().from(moment(time), true);
      }
      return null;
    };

    $scope.refresh = function () {
      $scope.failMessage = null;
      $scope.requests = {};
      $scope.getAllRequests();
    };


    $scope.refresh();
}]);
