// main angular module
var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        // controller : "welcomeController"
    })
    .when("/amazon", {
        templateUrl : "amazon.html",
        // controller : ["amazonController", "globalController"]
    })
    .otherwise({
        templateUrl : "home.html",
        // controller : "welcomeController"
    });
});

