/**
 * Created by paritosh on 01/04/17.
 */

autoApp.controller('CustomerCtrl', ['$scope', '$rootScope', '$location', 'Factory',
  function($scope, $rootScope, $location, Factory) {

  $scope.createRequest = function () {
      if($scope.user.id && $scope.user.x && $scope.user.y){
        if(parseInt($scope.user.x) < 0 || parseInt($scope.user.x) > 5) {
          $scope.failMessage = "Please enter value of X between 0 and 5";
        }
        else if(parseInt($scope.user.y) < 0 || parseInt($scope.user.y) > 5) {
          $scope.failMessage = "Please enter value of Y between 0 and 5";
        }
        else{
          Factory.createRequest({user_id: $scope.user.id, x: $scope.user.x, y: $scope.user.y}).then(function(response) {
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
      }
      else{
        if(!$scope.user.id) $scope.failMessage = "Please enter a user id";
        else if(!$scope.user.x) $scope.failMessage = "Please enter a value for X";
        else if(!$scope.user.y) $scope.failMessage = "Please enter a value for Y";
      }

  };

  $scope.refresh = function () {
    $scope.user = {};
    $scope.successMessage = null;
    $scope.failMessage = null;
  };

  $scope.refresh();
}]);
