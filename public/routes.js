'use strict';
console.log("routes.js declared");

angular.module('EventCMS')

.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
    });
    // For any unmatched url, send to /
    // $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('eventList', {
        url: '/listview',
        templateUrl: 'listview.html',
        controller: 'ListCtrl',
    })
    .state('addEvent', {
        url: '/add',
        templateUrl: 'addevent.html',
        controller: 'AddCtrl',
    })
    .state('mapEvent', {
        url: '/mapEvent',
        templateUrl: 'mapevent.html',
        controller: 'mapEventCtrl',
    })
    .state('login', {
        url: '/login',
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
    })
    .state('listComensal', {
        url: '/list_comensal',
        templateUrl: 'listcomensal.html',
        controller: 'ListComensalCtrl',
    })
    .state('editEvent', {
        url: '/edit',
        templateUrl: 'editevent.html',
        controller: 'EditCtrl',
        params: {passId: ""}
    })
    .state('register', {
        url: '/register',
        templateUrl: 'register.html',
        controller: 'RegisterCtrl'
    })
    .state('logOut', {
        url: '/',
        controller: 'LogoutCtrl',
    })
    .state('payevent', {
        url: '/payevent/:eventName/:eventAttentands/:eventPrice',
        templateUrl: 'payevent.html',
        controller: 'PayEventCtrl'
    })
});
