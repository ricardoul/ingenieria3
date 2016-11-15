angular.module('EventCMS')

.controller("mapEventCtrl", [
    "$rootScope", "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams","notificationService",
    function($rootScope, $scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

		
		 $log.info("ListComensal ran");

        //save the ID of the event to edit that was passed from the list view
        var editEventId = $stateParams.passId;
        $log.info("stateparms", editEventId);
        // var userId = firebase.auth().currentUser.uid;
        $scope.fireBaseRef = firebase.database().ref('/events')

        $scope.categories =['Bebidas','Cafetería','Calzones','Carnes','Celíacos','Chivitos','Comida Árabe','Comida Armenia','Comida China','Comida Japonesa','Comida Mexicana','Comida Peruana','Comida Vegetariana','Comida Venezolana','Desayunos','Empanadas','Ensaladas','Hamburguesas','Helados','Lehmeyun','Licuados y Jugos','Menú del día','Milanesas','Parrilla','Pastas','Pescados y Mariscos','Picadas','Pizzas','Postres','Sándwiches','Sushi','Tartas','Viandas y Congelados','Woks','Wraps']
        
        function updateEvents(){

         $scope.fireBaseRef.once('value').then(function(snapshot) {
                var arr = _.values(snapshot.val());
                for (var i=0; i<arr.length; i++){
                    if (!arr[i].attendants || typeof(arr[i].attendants) === "undefined"){
                        arr[i].attendants = [];
                    }
                }

                $scope.events = arr;
                $scope.$apply();
              // ...
            });
       }

        updateEvents()

        $scope.events = [
        ]

        $scope.checkAttendants = function(attendants){

            if(attendants && attendants.indexOf($rootScope.userId) > -1){
                return "Estas inscripto"
            }else{
                return "Inscribete ahora!"
            }

        }

        $scope.checkReserveButton = function(evento){

            if(evento.attendants && (evento.attendants.indexOf($rootScope.userId) > -1 || evento.attendants.length == evento.maxAttendants )){
                return true
            }else{
                return false
            }

        }


        $scope.asistirEvento = function(event){

            if(!$rootScope.userId){
                notificationService.error("Debe loguearse para inscribirse a los eventos");
            }
            else{
                if ($rootScope.userType != "Comensal"){
                    notificationService.error("Debe tener una cuenta de comensal para poder inscribirse a los eventos");
                } else {

                    if(!event.attendants || typeof(event.attendants) =="string" ){
                        event.attendants = []
                    }
                    if(event.attendants.length == event.maxAttendants || !event.maxAttendants ){
                        notificationService.error("Hubo un problema debido a la cantida de asistentes o se a llegado al maximo")
                    }

                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    event.attendants.push($rootScope.userId)
                    if(event.attendants.length == event.maxAttendants){
                        event.status="full"
                    }
                    $scope.fireBaseRef.remove()
                    $scope.fireBaseRef.update(angular.copy($scope.events));

                    notificationService.success("Inscripción al evento exitosa!");
                }
            }
    }

    $scope.rate = 7;
    $scope.max = 10;
    $scope.isReadonly = false;

      $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
      };

      $scope.ratingStates = [
        {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
        {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
        {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
        {stateOn: 'glyphicon-heart'},
        {stateOff: 'glyphicon-off'}
      ];
      

		
		
		
		

         //save the ID of the event to edit that was passed from the list view
        var editEventId = $stateParams.passId;
        $log.info("stateparms", editEventId);
        // var userId = firebase.auth().currentUser.uid;
        $scope.userId = "laca"
        $scope.fireBaseRef = firebase.database().ref('/events')
        
        function updateEvents(){

         $scope.fireBaseRef.once('value').then(function(snapshot) {
                var arr = _.values(snapshot.val());
                $scope.events = arr
                $scope.$apply()
              // ...
            });
       }
	   
	   	$scope.pinClicked = function(evento){
			$scope.eventFilter=$scope.events[0].eventTitle;
			//var vari=evento.$id;
		//	$scope.eventFilter=evento.eventTitle;
		}
        updateEvents()

        $scope.events = [
        ]
    }]);
