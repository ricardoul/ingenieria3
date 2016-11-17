angular.module('EventCMS')

.controller("LoginCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams", "notificationService",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("LoginCtrl ran");

        $rootScope.isLogin = false;

        $scope.login = function(){
            firebase.auth().signInWithEmailAndPassword($scope.username, $scope.password1).then(function() {
                notificationService.success("Login "+ $scope.username +" realizado correctamente");
                
                var userId = firebase.auth().currentUser.uid;

                $rootScope.userId   = userId;
                $rootScope.isLogin  = true;

                firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
                
                    var userData = snapshot.val();
                    $rootScope.userType = userData.info.type;

                    if (userData.info.type === 'Cocinero'){
                        $rootScope.isCocinero = true;
                        $state.go('eventList');
                    } else {
                        if (userData.info.type === 'Comensal'){
                            $rootScope.isCocinero = false;
                            $state.go('mapEvent');
                        }
                    }
					

                });

            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error("Usuario y/o contraseña incorrecta");
            });
        }

        $scope.logout = function(){
            firebase.auth().signOut().then(function() {
				
            
			}, function(error) {
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

                $rootScope.userId   = userId;

                updates['/users/'+userId+'/info/'] = $scope.newUser;


                // Redireccionar a página lista de eventos!!!
                if ($scope.newUser.type === "Cocinero"){
                    $rootScope.isCocinero = true;
                    $state.go('eventList');
                } else{
                    if ($scope.newUser.type === 'Comensal'){
                        $rootScope.isCocinero = false;
                        $state.go('mapEvent')
                    }
                }

                //notificationService.success("Usuario creado");
                return firebase.database().ref().update(updates);

            }, function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                notificationService.error(errorMessage);
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