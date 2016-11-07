angular.module('EventCMS')

.controller("AddCtrl", [
    "$rootScope", "$scope", "$location", "$timeout", "$state", "$log","$firebaseArray", "alertsManager", "notificationService",
    function($rootScope, $scope, $location, $timeout, $state, $log, $firebaseArray, alertsManager, notificationService) {

        var init=function(){
            if(!$rootScope.userId){
                console.log("Usuario no logueado");
                notificationService.error("Debe loguearse para ingresar eventos");
                $location.path("/");
            } else {
                if($rootScope.userType != "Cocinero"){
                    notificationService.error("Comensal no puede agregar eventos");
                    $location.path("/");
                }
            }
        }
        init();

        $log.info("AddCtrl ran");


        $scope.addAssistant = function(cant){
            $scope.lugaresCantidades[cant] +=1
        }

        $scope.removeAssistant = function(cant){
            $scope.lugaresCantidades[cant] -=1
        }

        $scope.checkNumber = function(cant){
            if($scope.lugaresCantidades[cant] < 1){
                $scope.lugaresCantidades[cant] = 1
                return
            }
            if($scope.lugaresCantidades[cant] > 300){
                $scope.lugaresCantidades[cant] = 300
                return
            }
        }

        $scope.checkCantUpper = function(cant, cantVar){
            return ($scope.lugaresCantidades[cantVar] >= cant)
        }
        
        $scope.checkCantLower = function(cant, cantVar){
           return ($scope.lugaresCantidades[cantVar] <= cant)
        }

        $scope.categories =['Bebidas','Cafetería','Calzones','Carnes','Celíacos','Chivitos','Comida Árabe','Comida Armenia','Comida China','Comida Japonesa','Comida Mexicana','Comida Peruana','Comida Vegetariana','Comida Venezolana','Desayunos','Empanadas','Ensaladas','Hamburguesas','Helados','Lehmeyun','Licuados y Jugos','Menú del día','Milanesas','Parrilla','Pastas','Pescados y Mariscos','Picadas','Pizzas','Postres','Sándwiches','Sushi','Tartas','Viandas y Congelados','Woks','Wraps']

        $scope.selectedCategorie = 'Carnes'

        $scope.cantidades=['mínima','máxima']

        $scope.lugaresCantidades = {mínima : 1, máxima: 50}

        //Firebase callback to register sync fail/success
        var onComplete = function(error) {
            if (error) {
                $rootScope.$broadcast('saveEvent', {message: "Event Creation Failed", result: "failure"});
                $log.log('Synchronization failed');
                buttonClickEnable();
            } else {
                $rootScope.$broadcast('saveEvent', {message: "Event Created!", result: "success"});
                $log.log('Synchronization succeeded');
                buttonClickEnable();
            }
        };

        //create Firebase events array
        var ref = {}

        //define empty event/ database schema
        var EMPTY_EVENT = {
            eventTitle:    " ",
            eventLocation: " ",
            startDate:     new Date(),
            endDate:       new Date(),
            category:      " ",
            maxAttendants: " ",
            minAttendants: " ",
            description:   " ",
            featuredFlag:  " ",
            createdAt:     " ",
            updatedAt:     " ",
            attendants:    [],
            eventPrice:    0,
        };

        function setup_empty_event_state() {
            $scope.event = angular.copy(EMPTY_EVENT);
        };

        var unixStart = " ";
        var unixEnd = " ";
        var unixCurrent = " ";

        function transform_dates_to_unix(start,end) {
            //Date picker dates are in "Zulu time" (UTC)
            //convert to unix/integer format that is acceptable to Firebase
            unixStart = start.getTime();
            unixEnd = end.getTime();
            //capture current date in unix/integer format
            var d = new Date ();
            unixCurrent = d.getTime();
        };

        //addEvent function will add a newEvent based on database schema
        $scope.addEvent = function() {
            if(checkEmptyFields() === false){return}
            var today =  new Date();
            if ($scope.newEvent.startDate < today || $scope.newEvent.endDate < today){
                notificationService.error("Las fechas deben ser mayores al día de hoy");
            } else {
                transform_dates_to_unix($scope.newEvent.startDate,$scope.newEvent.endDate);

                $scope.event = {
                    eventTitle:    $scope.newEvent.eventTitle,
                    eventLocation: $scope.newEvent.eventLocation,
                    startDate:     unixStart,
                    endDate:       unixEnd,
                    maxAttendants: $scope.lugaresCantidades.máxima,
                    minAttendants: $scope.lugaresCantidades.mínima,
                    category:      $scope.newEvent.category,
                    description:   $scope.newEvent.description,
                    //featuredFlag:  $scope.newEvent.featuredFlag,
                    createdAt:     unixCurrent,
                    updatedAt:     " ",
                    //attendants:  "laca",
                    status:        "open",
                    eventPrice:    $scope.newEvent.eventPrice
                };
                notificationService.success("Evento creado")
                // Get a key for a new Post.
                var newPostKey = firebase.database().ref().child('events').push().key;

                  // Write the new post's data simultaneously in the posts list and the user's post list.
                var updates = {};
                updates['/events/' + newPostKey] = $scope.event;
                updates['/users/' + $rootScope.userId + '/events/'+ newPostKey] = $scope.event;
                return firebase.database().ref().update(updates);

                // Redirigir a la página de lista de eventos del cocinero!!
            }
        };

        //call setup empty state to reset the entry form
        setup_empty_event_state();

        //setup alerts in controller scope
        $scope.alerts = alertsManager.alerts;

        //use $on method to receive Broadcast of Alert message
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

        //close alert called after time out or x is clicked and alert array item is removed
        $scope.closeAlert = function (index) {
            alertsManager.remove(index);
        };

        buttonClickDisable = function(){
            $scope.buttonDisabled = true;
            $scope.buttonValue = "processing...";
            $log.info("button clicked & disabled");
        }

        buttonClickEnable = function(){
            $scope.buttonDisabled = false;
            $scope.buttonValue = "Add Event";

            $log.info("button enabled");
        }

        checkEmptyFields = function(){
            if(!$scope.newEvent.eventtitle){
                notificationService.error('Debe ingresar un título para el evento');
                return false;
            }
            if(!$scope.newEvent.eventLocation){
                notificationService.error('Debe ingresar la ubicación del evento');
                return false;
            }
            if(!$scope.newEvent.category){
                notificationService.error('Debe seleccionar una categoría');
                return false;
            }
            if(!$scope.newEvent.description){
                notificationService.error('Debe ingresar la commida del evento');
                return false;
            }
            if(!$scope.newEvent.startDate || !$scope.newEvent.startHour || $scope.newEvent.endDate || $scope.newEvent.endHour){
                notificationService.error('Debe ingresar la fecha y hora del evento');
                return false;
            }
            if(!$scope.newEvent.eventPrice){
                notificationService.error('Debe ingresar el precio del ticket');
                return false;
            }
            return true;
        }

    }]);