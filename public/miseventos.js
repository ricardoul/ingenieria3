angular.module('EventCMS')

.controller("MisEventosCtrl", [
    "$rootScope", "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams","notificationService",
    function($rootScope, $scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("MisEventosCtrl ran");

        //save the ID of the event to edit that was passed from the list view
        var editEventId = $stateParams.passId;
        $log.info("stateparms", editEventId);
        // var userId = firebase.auth().currentUser.uid;
        $scope.fireBaseRef = firebase.database().ref('/events')

        $scope.categories =['Bebidas','Cafetería','Calzones','Carnes','Celíacos','Chivitos','Comida Árabe','Comida Armenia','Comida China','Comida Japonesa','Comida Mexicana','Comida Peruana','Comida Vegetariana','Comida Venezolana','Desayunos','Empanadas','Ensaladas','Hamburguesas','Helados','Lehmeyun','Licuados y Jugos','Menú del día','Milanesas','Parrilla','Pastas','Pescados y Mariscos','Picadas','Pizzas','Postres','Sándwiches','Sushi','Tartas','Viandas y Congelados','Woks','Wraps']
        
        function updateEvents(){

         $scope.fireBaseRef.once('value').then(function(snapshot) {
                var arr = _.values(snapshot.val());
                var arrayOfEvents = new Array();
                var indice = 0;
                for (var i=0; i<arr.length; i++){
                    if (arr[i].attendants || typeof(arr[i].attendants) != "undefined"){
                        for (var j=0; j<arr[i].attendants.length; j++){
                            if (arr[i].attendants[j] === $rootScope.userId){
                                arrayOfEvents.push(arr[i]);
                                indice ++;
                            }
                        }
                    }
                }

                $scope.events = arrayOfEvents;
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

      

    }]);
