angular.module('EventCMS')

.controller("PayEventCtrl", [
    "$scope", "$state", "$log","$firebaseArray", "$stateParams", "notificationService","$timeout",
    function($scope, $state, $log, $firebaseArray, $stateParams, notificationService, $timeout) {
        $log.info("ListCtrl ran");

        //create Firebase events firebaseArray
        $scope.event = [{"id":"algo"}]
       // var userId = firebase.auth().currentUser.uid;
       var userId = "laca"


	   function updateEvents(){
		   	firebase.database().ref('events/'+ $stateParams.eventId).once('value').then(function(snapshot) {
			  	$scope.event = snapshot.val()
			  	$scope.event.totalPrice =$scope.event.attendants.length * parseFloat($scope.event.eventPrice) * 0.10
			  	$scope.$apply()
			  	notificationService.success("Costo calculado correctamente!")
			  // ...
			});
	   }

	   updateEvents()
	   $timeout(function(){
	   		notificationService.info("Estamos calculando el costo del evento...")
		},10)

	   	$scope.makePayment = function(){
	   		if($scope.cardNumber && $scope.cardNumber.length > 0 &&
	   			$scope.cardexpiration && $scope.cardexpiration.length > 0 &&
	   			$scope.cardcvc && $scope.cardcvc.length > 0){
	   			notificationService.info("Procesando pago")
	   			$timeout(function(){
		   			if($scope.cardNumber =="12345"){
		   				notificationService.success("Pago correcto")
		   			}else{
		   				notificationService.error("Hay un error procesando el pago")
		   			}
		   		}, 500); 

	   			}else{
	   				notificationService.error("Verifique los datos introducidos")
	   			}
	   }


	   $scope.dateFrom =new Date('10/01/2016 00:00:00');
	   $scope.dateTo =new Date()
	   

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
