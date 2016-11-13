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
        templateUrl: 'mapEvent.html',
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
    .state('about', {
        url: '/about',
        templateUrl: 'about.html'
    })
    .state('payEvent', {
        url: '/payEvent',
        templateUrl: 'payEvent.html',
        controller: 'PayEventCtrl'
    })
});
