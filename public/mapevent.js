angular.module('EventCMS')

.controller("mapEventCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams", 
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams)  {

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
    }]);
