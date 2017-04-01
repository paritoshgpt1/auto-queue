'use strict';

var autoApp = angular.module('autoApp', ['ngRoute']);
autoApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.when('/driverapp', {
      templateUrl: '/templates/driverapp.html',
      controller: 'DriverCtrl'
    }).otherwise({
      redirectTo: '/',
      caseInsensitiveMatch: true
    });
    $locationProvider.html5Mode(true);
  }]);
