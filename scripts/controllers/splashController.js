/**
 * Splash controller
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var controllerId = "splashController";

    app.controller(controllerId, ["$scope", "$state", "$timeout", splashController]);

    function splashController ($scope, $state, $timeout) {

        var model = {

            title: "Hello World",
            desc: "This is the splash screen",

            version: null
        };

        $timeout(function () {

            $state.go("home");

        }, 2000);

        $scope.$on("$destroy", function () {

            model = null;
            console.log(controllerId + ".$destroy");

        });

        $scope.model = model;
    }

})();