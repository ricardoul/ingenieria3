angular.module('EventCMS')

.controller("ListComensalCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams","notificationService",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("ListComensal ran");

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

        updateEvents()

        $scope.events = [
        ]

        $scope.checkAttendants = function(attendants){

            if(attendants && attendants.indexOf($scope.userId) > -1){
                return "Estas inscripto"
            }else{
                return "Inscribete ahora!"
            }

        }

        $scope.checkReserveButton = function(evento){

            if(evento.attendants && (evento.attendants.indexOf($scope.userId) > -1 || evento.attendants.length == evento.maxAttendants )){
                return true
            }else{
                return false
            }

        }


        $scope.asistirEvento = function(event){

            if(!event.attendants || typeof(event.attendants) =="string" ){
                event.attendants = []
            }
            if(event.attendants.length == event.maxAttendants || !event.maxAttendants ){
                notificationService.error("Hubo un problema debido a la cantida de asistentes o se a llegado al maximo")
            }

            // Write the new post's data simultaneously in the posts list and the user's post list.
            event.attendants.push($scope.userId)
            if(event.attendants.length == event.maxAttendants){
                event.status="full"
            }
            $scope.fireBaseRef.remove()
            $scope.fireBaseRef.update(angular.copy($scope.events));
    }


      

    }]);
