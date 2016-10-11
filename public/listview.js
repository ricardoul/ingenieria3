angular.module('EventCMS')

.controller("ListCtrl", [
    "$scope", "$state", "$log","$firebaseArray", "$stateParams",
    function($scope, $state, $log, $firebaseArray, $stateParams) {
        $log.info("ListCtrl ran");

        //create Firebase events array
        $scope.events = [{"id":"algo"}]
       // var userId = firebase.auth().currentUser.uid;
       var userId = "laca"


	   function updateEvents(){
		   	firebase.database().ref('/users/' + userId+'/events').once('value').then(function(snapshot) {
			  	var arr = _.values(snapshot.val());
			  	$scope.events = arr
			  	$scope.$apply()
			  // ...
			});
	   }
	   updateEvents()

}]);
