angular.module('EventCMS')

.controller("AddCtrl", [
    "$rootScope", "$scope", "$location", "$timeout", "$state", "$log","$firebaseArray", "alertsManager", "notificationService",
    function($rootScope, $scope, $location, $timeout, $state, $log, $firebaseArray, alertsManager, notificationService) {

        var init=function(){
            if(!$rootScope.userId){
                console.log("Usuario no logueado");
                notificationService.error("Debe loguearse para ingresar eventos");
                //$location.path("/");
                $state.go('login');
            } else {
                if($rootScope.userType != "Cocinero"){
                    notificationService.error("Debe loguearse con una cuenta de cocinero para agregar eventos");
                    //$location.path("/");
                    $state.go('login');
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
            cooker:        " ",
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
            var startDate = new Date($scope.newEvent.startDate.getFullYear(),
                                    $scope.newEvent.startDate.getMonth()+1,
                                    $scope.newEvent.startDate.getDate(),
                                    $scope.newEvent.startHour.getHours(),
                                    $scope.newEvent.startHour.getMinutes(),
                                    $scope.newEvent.startHour.getSeconds());
            var endDate = new Date($scope.newEvent.endDate.getFullYear(),
                                    $scope.newEvent.endDate.getMonth()+1,
                                    $scope.newEvent.endDate.getDate(),
                                    $scope.newEvent.endHour.getHours(),
                                    $scope.newEvent.endHour.getMinutes(),
                                    $scope.newEvent.endHour.getSeconds());

            if (startDate < today || endDate < today){
                notificationService.error("Las fechas deben ser mayores al día de hoy");
                return;
            }
            if (startDate > endDate){
                notificationService.error("La fecha desde debe ser menor a la fecha hasta");
                return;
            } else {

                transform_dates_to_unix($scope.newEvent.startDate,$scope.newEvent.endDate);

                var street = $scope.address.components.street + ' '  + $scope.address.components.streetNumber;
                var location = {
                    street:  street,
                    lat:     $scope.address.components.location.lat, 
                    long:    $scope.address.components.location.long
                }

                firebase.database().ref('/users/' + $rootScope.userId).once('value').then(function(snapshot){
                    cooker = snapshot.val().info.name + ' '  +  snapshot.val().info.lastName;

                    $scope.event = {
                        eventTitle:    $scope.newEvent.eventTitle,
                        eventLocation: location,                    
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
                        status:        "abierto",
                        eventCooker:   cooker,
                        eventPrice:    $scope.newEvent.eventPrice
                    };
                    notificationService.success("Evento creado")
                    // Get a key for a new Post.
                    var newPostKey = firebase.database().ref().child('events').push().key;

                      // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/events/' + newPostKey] = $scope.event;
                    updates['/users/' + $rootScope.userId + '/events/'+ newPostKey] = $scope.event;
                    firebase.database().ref().update(updates);

                    // Redirigir a la página de lista de eventos del cocinero!!
                    $state.go('eventList');

                    return
                });

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
            if(!$scope.newEvent.eventTitle){
                notificationService.error('Debe ingresar un título para el evento');
                return false;
            }
            if(!$scope.newEvent.eventAddress){
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
            /*if(!$scope.newEvent.startDate){
                notificationService.error('Debe ingresar la fecha y hora del evento');
                return false;
            }
            if(!$scope.newEvent.startHour){
                notificationService.error('Debe ingresar la fecha y hora del evento');
                return false;
            }
            if($scope.newEvent.endDate){
                notificationService.error('Debe ingresar la fecha y hora del evento');
                return false;
            }
            if($scope.newEvent.endHour){
                notificationService.error('Debe ingresar la fecha y hora del evento');
                return false;
            }*/
            if(!$scope.newEvent.eventPrice){
                notificationService.error('Debe ingresar el precio del ticket');
                return false;
            }
            return true;
        }
        
    }]);