/**
 * Created by paritosh on 01/04/17.
 */

autoApp.controller('CustomerCtrl', ['$scope', '$rootScope', '$location', 'Factory',
  function($scope, $rootScope, $location, Factory) {

  $scope.createRequest = function () {
      if($scope.user_id){
        Factory.createRequest({user_id: $scope.user_id}).then(function(response) {
          console.log("getStatusForDriver response: ",response);
          $scope.refresh();
          if(response.status == 'success') {
            $scope.successMessage = response.data;
          }
          else{
            $scope.failMessage = response.data;
          }
        });
      }
      else{
        $scope.refresh();
        $scope.failMessage = "Please enter a user id";
      }

  };

  $scope.refresh = function () {
    $scope.user_id = null;
    $scope.successMessage = null;
    $scope.failMessage = null;
  };

  $scope.refresh();
}]);
