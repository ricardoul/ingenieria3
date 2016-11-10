angular.module('EventCMS')

.controller("AddCtrl", [
    "$rootScope", "$scope", "$timeout", "$state", "$log","$firebaseArray", "alertsManager", "notificationService",
    function($rootScope, $scope, $timeout, $state, $log, $firebaseArray, alertsManager, notificationService) {

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

        $scope.cantidades=['maxima', 'minima']

        $scope.lugaresCantidades = {maxima: 50, minima : 1}

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
            eventTitle: " ",
            startDate: new Date(),
            endDate: new Date(),
            category: " ",
            maxAttendants: " ",
            minAttendants: " ",
            description: " ",
            featuredFlag: " ",
            createdAt:  " ",
            updatedAt: " ",
            attendants: [],
			latLng: [],
        };

        function setup_empty_event_state() {
            $scope.newEvent = angular.copy(EMPTY_EVENT);
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
            transform_dates_to_unix($scope.newEvent.startDate,$scope.newEvent.endDate);

            $scope.newEvent = {
                eventTitle: $scope.newEvent.eventTitle,
                startDate: unixStart,
                endDate: unixEnd,
                maxAttendants: $scope.newEvent.maxAttendants,
                minAttendants: $scope.newEvent.minAttendants,
                category: $scope.newEvent.category,
                description: $scope.newEvent.description,
                featuredFlag: $scope.newEvent.featuredFlag,
                createdAt:  unixCurrent,
                updatedAt: " ",
                attendants: "laca",
                status: "open",
				latLng: $scope.newEvent.latLng
            };
            notificationService.success("Evento creado")
            // Get a key for a new Post.
            var newPostKey = firebase.database().ref().child('events').push().key;

              // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates['/events/' + newPostKey] = $scope.newEvent;
            updates['/users/laca/events/'+ newPostKey] = $scope.newEvent;
            return firebase.database().ref().update(updates);

            
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

    }]);
