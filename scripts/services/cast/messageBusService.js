/**
 * Manages the message bus
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "messageBusService";

    app.service(serviceId, ["$rootScope", "cast", "castReceiverManagerService", messageBusService]);

    function messageBusService($rootScope, cast, castReceiverManagerService) {

        this.messageBus = null;

        this.init = function () {

            castReceiverManagerService.init();

            if (this.messageBus != null)
                return false;

            console.log(serviceId + ".init");

            this.messageBus = castReceiverManagerService.manager.getCastMessageBus(appConstant.APP.NAMESPACE);

            this.messageBus.onMessage = function (event) {

                console.log("messageBus.onMessage: " + JSON.stringify(event["data"]));

                var payload = JSON.parse(event["data"]);

                if (typeof payload["type"] == "undefined" || payload["type"] == null || typeof payload["type"] != "string")
                    return;

                if (payload["type"].toLowerCase() == "log") {

                    if (payload["level"] && typeof payload["level"] == "string") {

                        if (payload["level"].toLowerCase() == "verbose") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.VERBOSE);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.VERBOSE);

                            $rootScope.$broadcast("displayDebugInfo", true);

                        } else if (payload["level"].toLowerCase() == "debug") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.DEBUG);

                            $rootScope.$broadcast("displayDebugInfo", true);

                        } else if (payload["level"].toLowerCase() == "none") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.NONE);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.NONE);

                            $rootScope.$broadcast("displayDebugInfo", false);

                        } else if (payload["level"].toLowerCase() == "info") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.INFO);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.INFO);

                            $rootScope.$broadcast("displayDebugInfo", true);

                        } else if (payload["level"].toLowerCase() == "warning") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.WARNING);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.WARNING);

                            $rootScope.$broadcast("displayDebugInfo", false);

                        } else if (payload["level"].toLowerCase() == "error") {
                            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.ERROR);
                            cast.player.api.setLoggerLevel(cast.receiver.LoggerLevel.ERROR);

                            $rootScope.$broadcast("displayDebugInfo", false);
                        }

                    }

                } else if (payload["type"].toLowerCase() == "version") {

                    this.broadcast(JSON.stringify({
                        type: "version",
                        value: appConstant.APP.VERSION
                    }));

                }

            };

            return true;
        };

        return this;

    }

})();
