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

}]).filter("myfilter", function() {
		  return function(items, from, to) {
		        var df = from; //parseDate(from);
		        var dt = to; //parseDate(to);
		        var result = [];        
		        for (var i=0; i<items.length; i++){
		            var tf = new Date(items[i].startDate),
		                tt = new Date(items[i].startDate);
		            if (tf > df && tt < dt)  {
		                result.push(items[i]);
		            }
		        }            
		        return result;
		  };
		});

function parseDate(input) {
		  var parts = input.split('/');
		  return new Date(parts[2], parts[1]-1, parts[0]); 
		}
