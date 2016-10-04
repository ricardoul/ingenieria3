angular.module('EventCMS')

.controller("LoginCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams", "notificationService",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("LoginCtrl ran");

        $scope.login = function(){
            firebase.auth().signInWithEmailAndPassword($scope.username, $scope.password).then(function() {
                notificationService.success("Login "+ $scope.username +" correctamente")
            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error(errorMessage)
            });
        }

        $scope.signup = function(){
            firebase.auth().createUserWithEmailAndPassword($scope.username, $scope.password).then(function() {
                notificationService.success("Cuenta "+ $scope.username +" creada correctamente")
            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error(errorMessage)
            });
        }

        //save the ID of the event to edit that was passed from the list view
        $scope.isRegister = false

        $scope.selectType = function(type){
            if(type == 'register'){
                $scope.isRegister = true
            }else{
                $scope.isRegister = false
            }

        }
    }]);
