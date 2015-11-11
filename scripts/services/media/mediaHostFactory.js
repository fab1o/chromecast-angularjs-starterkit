/**
 * Manages the media host
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "mediaHostFactory";

    app.factory(serviceId,
        ["cast", "$rootScope", "castReceiverManagerService", "$state", "messageBusService", "videoElementService", mediaHostFactory]);

    function mediaHostFactory(cast, $rootScope, castReceiverManagerService, $state, messageBusService, videoElementService) {

        return {
            MediaHost: MediaHost
        };

        function MediaHost(url) {

            console.log("MediaHost url: " + url);

            var mediaHost = new cast.player.api.Host({
                mediaElement: videoElementService.videoElement,
                url: url,
                licenseUrl: null
            });

            mediaHost.onError = function (errorCode) {

                console.error('mediaHost.onError - errorCode: ' + errorCode);
                castReceiverManagerService.manager.setApplicationState("");

                messageBusService.messageBus.broadcast(JSON.stringify({
                    type: "cancel"
                    //,senderId: params.senderId //optional: for multiple senders
                }));

                $rootScope.$broadcast("$loadingCompleted");

                $state.go("home");
            };

            return mediaHost;
        }

    }

})();

