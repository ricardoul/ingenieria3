angular.module('EventCMS')

.controller("LoginCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams", "notificationService",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("LoginCtrl ran");

        $scope.login = function(){
            firebase.auth().signInWithEmailAndPassword($scope.username, $scope.password1).then(function() {
                notificationService.success("Login "+ $scope.username +" correctamente")
            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error(errorMessage)
            });
        }

        function transform_dates_to_unix(start,end) {
            //Date picker dates are in "Zulu time" (UTC)
            //convert to unix/integer format that is acceptable to Firebase
            unixStart = start.getTime();
            unixEnd = end.getTime();
            //capture current date in unix/integer format
            var d = new Date ();
            unixCurrent = d.getTime();
        };

        $scope.newUser = {
            type: "Cocinero"
        }

        $scope.signup = function(){
            if (!$scope.checkEmptyFields()){return}
            if ($scope.password1 != $scope.password2) {
                notificationService.error("Las contraseñas son diferentes");
                return
            }

            firebase.auth().createUserWithEmailAndPassword($scope.username, $scope.password1).then(function() {
                notificationService.success("Cuenta "+ $scope.username +" creada correctamente")

                var userId = firebase.auth().currentUser.uid;
   
                var updates = {};
                updates['/users/'+userId+'/info/'] = $scope.newUser;

                notificationService.success("Usuario creado");
                return firebase.database().ref().update(updates);

            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error(errorMessage)
            });

        }

        $scope.isRegister = false

        $scope.selectType = function(type){
            if(type == 'register'){
                $scope.isRegister = true
            }else{
                $scope.isRegister = false
            }

        }

        $scope.checkEmptyFields = function(){
            if (!$scope.newUser.name || $scope.newUser.name.length === 0){
                notificationService.error("El nombre no puede ser vacio");
                return false
            }
            if (!$scope.newUser.lastName || $scope.newUser.lastName.length === 0){
                notificationService.error("El apellido no puede ser vacio");
                return false
            }
            if (!$scope.newUser.birthDate || $scope.newUser.birthDate.length === 0){
                notificationService.error("La fecha de nacimiento no puede ser vacia");
                return false
            }
            if (!$scope.username ||$scope.username === 0){
                notificationService.error("El correo no puede ser vacio");
                return false
            }
            if (!$scope.password1 || $scope.password1 === 0){
                notificationService.error("Las passwrod no puede ser vacia");
                return false
            }
            if (!$scope.password2 || $scope.password2 === 0){
                notificationService.error("Las passwrod no puede ser vacia");
                return false
            }
            
            return true;   
        }
    }]);
