angular.module('EventCMS')

.controller("LogoutCtrl", [
    "$scope", "$state", "$log", "$timeout", "$firebaseArray", "alertsManager", "$rootScope", "$stateParams", "notificationService",
    function($scope, $state, $log, $timeout, $firebaseArray, alertsManager, $rootScope, $stateParams, notificationService)  {

        $log.info("LogoutCtrl ran");


        var init=function(){
            firebase.auth().signOut().then(function() {
				console.log('Log out ok!');
                $rootScope.isLogin = false;
                $rootScope.userId = null;
                $rootScope.isCocinero = false;
            
			}, function(error) {
              notificationService.error(errorMessage)
            });
        }

        init();
    }]);