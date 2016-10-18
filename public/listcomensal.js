angular.module('EventCMS')

.controller("ListComensalCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams)  {

        $log.info("ListComensal ran");

        //save the ID of the event to edit that was passed from the list view
        var editEventId = $stateParams.passId;
        $log.info("stateparms", editEventId);
		
		//define empty event/ database schema
        var EMPTY_EVENT = {
            eventTitle: " ",
            startDate: new Date(),
            endDate: new Date(),
            category: " ",
            description: " ",
            featuredFlag: " ",
            createdAt:  " ",
            updatedAt: " "
        };

        $scope.events = [
            {
                "name":"nombre1",
                "date":"Lunes",
                "location": "Montevideo"
            },
            {
                "name":"nombre2",
                "date":"mARTES",
                "location": "Maldonado, en lo del laca"
            }

        ]
		
		$scope.mostrarEventos = function(){
			//Desplegar los eventos a los que vaya a asistir en la lista de eventos
			//Desplegar todos los eventos en el mapa de eventos
        }

        $scope.seleccionarEvento = function(){
			//Despliega en el cuadro de evento el evento seleccionado de la lista de eventos
			
            //eventTitle
            //startDate
            //endDate
            //category
            //description
            //featuredFlag
            //createdAt
        }

        $scope.asistirEvento = function(Event){
			//El boton asigna al usuario como comensal y de paso muestra como aumenta la cantidad de comensales en el evento
			//Si menor a minComenzales barra en verde sino barra en amarillo si mayor a maxComensales rojo y dice "No hay lugares disponibles"
			var elem = document.getElementById("myBar");
			var width = eventSelect.Comensales;
			var id = setInterval(frame, 10);
			width = Event.maxComensales
			function frame() {
					if (width >= Event.maxComensales) {
						document.getElementById("label").innerHTML = 'No hay espacio disponible';
						clearInterval(id);
						//Setear el nuevo tamanio
					} else {
						width++;
						elem.style.width = width + '%';
						//Setear el nuevo tamanio
					}
			}
        }

        //Firebase callback to register sync fail/success
        var onComplete = function(error) {
            if (error) {
                $rootScope.$broadcast('saveEvent', {message: "Event Update Failed", result: "failure"});
                $log.log('Synchronization failed');
            } else {
                $rootScope.$broadcast('saveEvent', {message: "Event Updated", result: "success"});
                $log.log('Synchronization succeeded-2');
            }
        };

        //get reference to Firebase events array
        var ref = new Firebase("https://dazzling-torch-1941.firebaseio.com/events");

        //scope event variable to sync with inputs in the view
        $scope.event = {};

        //declare global variable for Updated date
        var unixUpdatedDate = "";

        function transform_to_date_object(start,end) {

            //Dates in Firebase are unix/integer format
            //Convert to date object for date
            eventSnapshot.startDate = new Date(start);
            eventSnapshot.endDate = new Date(end);

            //capture current date for updatedAt in unix/integer format
            var d = new Date ();
            unixUpdatedDate = d.getTime();
        };

        //declare variable to store retrieved event data
        var eventSnapshot = {};

        //retrieve data as object for specific event with Firebase "on" method
        ref.on("value", function(snapshot) {
            eventSnapshot = snapshot.child(editEventId).val(); //single event to edit
            //call transform dates function to convert from unix to date objects
            transform_to_date_object (eventSnapshot.startDate,eventSnapshot.endDate);

        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
        //sync retrieved event data to the view
        $scope.event = eventSnapshot;

        //declar variables for date conversion
        var unixStart = " ";
        var unixEnd = " ";
        var unixCurrent = " ";

        function transform_dates_to_unix(start,end) {
            //Date picker dates are in "Zulu time" (UTC)
            //convert to unix/integer format that is acceptable to Firebase
            unixStart = start.getTime();
            // debugger
            unixEnd = end.getTime();
            //capture current date in unix/integer format
            var d = new Date ();
            unixCurrent = d.getTime();
        };

        //editevent function saves edited data to the event in Firebase
        $scope.editEvent = function() {
            //transform dates from date picker to unix
            transform_dates_to_unix($scope.event.startDate,$scope.event.endDate);
            //pull data from view into updatedEvent object
            var updatedEvent = {
                eventTitle: $scope.event.eventTitle,
                startDate: unixStart,
                endDate: unixEnd,
                category: $scope.event.category,
                description: $scope.event.description,
                featuredFlag: $scope.event.featuredFlag,
                // createdAt:  don't need to update this property
                updatedAt: unixCurrent,
            };

            //use firebase 'update' method to save event data
            //onComplete is a callback with Firebase success/error message on data write
            ref.child(editEventId).update(updatedEvent,onComplete);
        };

        //setup alerts in controller scope
        $scope.alerts = alertsManager.alerts;

        //use Broadcast $on method to receive Broadcast of Alert message
        //add the Broadcast message (message, result) to alertsManager
        $scope.$on('saveEvent', function(event,args) {
            alertsManager.add({
                message: args.message,
                type: args.result,
            });
            //use Angular $timeout to call closeAlert function after X milliseconds
            $timeout(function () {$scope.closeAlert();},3000);
            $scope.$apply();
        });

        //close alert when icon is clicked by removing array item
        $scope.closeAlert = function (index) {
            alertsManager.remove(index);
        };

    }]);
