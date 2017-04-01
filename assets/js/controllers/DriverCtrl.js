/**
 * Created by paritosh on 01/04/17.
 */

autoApp.controller('DriverCtrl', ['$scope', '$rootScope', '$location', 'Factory',
  function($scope, $rootScope, $location, Factory) {

  $scope.driver_id = $location.search().id;
  $scope.getStatusForDriver = function () {
      Factory.getStatusForDriver({driver_id: $scope.driver_id}).then(function(response) {
        if(response.status == 'success') {
          $scope.requests = response.data;
          if($scope.requests.hasOwnProperty('waiting')) {
            $scope.waiting = $scope.requests.waiting;
          }
          if($scope.requests.hasOwnProperty('ongoing')) {
            $scope.ongoing = $scope.requests.ongoing;
          }
          if($scope.requests.hasOwnProperty('complete')) {
            $scope.completed = $scope.requests.complete;
          }
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
    $scope.successMessage = null;
    $scope.failMessage = null;
    $scope.waiting = {};
    $scope.ongoing = {};
    $scope.completed = {};
    $scope.getStatusForDriver();
  };

  $scope.refresh();

  $scope.acceptRequest = function(request_id) {
    console.log(request_id);
    Factory.acceptRequest({request_id: request_id, driver_id: $scope.driver_id}).then(function(response) {
      console.log(response);
      $scope.refresh();
      if(response.status == 'success') {
        $scope.successMessage = response.data;
      }
      else{
        $scope.failMessage = response.data;
      }
    })
  };

}]);
