/**
 * Manages the cast (the entry point for the casting cycle)
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "castReceiverManagerService";

    app.service(serviceId, ["cast", castReceiverManagerService]);

    function castReceiverManagerService(cast) {

        this.manager = null;

        this.init = function () {

            if (this.manager != null)
                return false;

            console.log(serviceId + ".init");

            cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.NONE);
            cast.player.api.setLoggerLevel(cast.player.api.LoggerLevel.NONE);

            this.manager = cast.receiver.CastReceiverManager.getInstance();

            this.manager.onSenderDisconnected = function (e) {

                if (this.getSenders().length == 0 && e.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
                    window.close();
                }

            };

            return true;
        };

        return this;

    }
})();