/**
 * App controller
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var controllerId = "appController";

    app.controller(controllerId, ["$scope", "cast", "castReceiverManagerService", appController]);

    function appController($scope, cast, castReceiverManagerService) {

        var appConfig = new cast.receiver.CastReceiverManager.Config();

        appConfig.maxInactivity = appConstant.APP.MAX_INACTIVITY * 60;

        castReceiverManagerService.manager.start(appConfig);

        var model = {

            version: appConstant.APP.VERSION,

            displayDebugInfo: false

        };

        $scope.$on("displayDebugInfo", function (e, value) {

            value = value || false;

            $scope.$apply(function () {

                model.displayDebugInfo = value;

            });

        });

        $scope.model = model;

    }

})();