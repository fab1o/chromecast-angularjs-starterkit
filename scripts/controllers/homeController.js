/**
 * Home controller
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var controllerId = "homeController";

    app.controller(controllerId, ["$scope", homeController]);

    function homeController ($scope) {

        var model = {

            title: "Hello World!"

        };

        $scope.$on("$destroy", function () {

            model = null;
            console.log(controllerId + ".$destroy");

        });

        $scope.model = model;
    }

})();