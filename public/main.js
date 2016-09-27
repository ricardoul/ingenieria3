angular.module('EventCMS')

.controller("MainCtrl", [
    "$scope", "$state", "$log","$firebaseArray", "$stateParams",
    function($scope, $state, $log, $firebaseArray, $stateParams) {
        $log.info("MainCtrl ran");
        $scope.state = $state;
        $scope.isLogged = true;

}]);
