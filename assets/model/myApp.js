// main angular module
var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "assets/components/home/index.html",
        // controller : "welcomeController"
    })
    .when("/amazon", {
        templateUrl : "assets/components/amazon/index.html",
        // controller : ["amazonController", "globalController"]
    })
    .otherwise({
        templateUrl : "assets/components/home/index.html",
        // controller : "welcomeController"
    });
});

