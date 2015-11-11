/**
 * Main Application
 * @author Fabio Costa
 */
var app = (function () {
    "use strict";

    var app = angular.module("helloApp", [
        "ui.router"
    ]);

    /**
     * @typedef {cast} cast
     */
    app.constant("cast", cast);

    app.config(["$stateProvider", function ($stateProvider) {

        $stateProvider
            .state("home", {
                templateUrl : "views/home.html",
                controller : "homeController"
            })
            .state("player", {
                templateUrl : "views/player.html",
                controller : "playerController"
            })
            .state("splash", {
                templateUrl : "views/splash.html",
                controller : "splashController"
            });

    }]);

    app.run(["messageBusService", "mediaManagerService", run]);

    function run(messageBusService, mediaManagerService) {

        messageBusService.init();
        mediaManagerService.init();

        $state.go("splash");
    }

    return app;

})();