/**
 * Created by paritosh on 01/04/17.
 */

autoApp.controller('DriverCtrl', ['$scope', '$rootScope', '$location', 'Factory',
  function($scope, $rootScope, $location, Factory) {
    // console.log($location.path());
    // console.log($location.search());
    // console.log($location.hash());

    $scope.driver_id = $location.search().id;

  $scope.getStatusForDriver = function () {
      Factory.getStatusForDriver({driver_id: $scope.driver_id}).then(function(response) {
        console.log("getStatusForDriver response: ",response);
        $scope.requests = response;
        if(response.hasOwnProperty('waiting')) {
          $scope.waiting = response.waiting;
        }
        if(response.hasOwnProperty('ongoing')) {
          $scope.ongoing = response.ongoing;
        }
        if(response.hasOwnProperty('complete')) {
          $scope.completed = response.complete;
        }
      });
  };

  // Factory.getStatusForDriver().then(function(response) {
  //   console.log("getStatusForDriver response: ",response);
  //   $scope.todos = response;
  // });

  $scope.refresh = function () {
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
    })
  }
}]);
