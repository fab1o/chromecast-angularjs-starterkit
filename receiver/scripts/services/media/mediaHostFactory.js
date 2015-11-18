/**
 * Manages the media host
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "mediaHostFactory";

    app.factory(serviceId, ["cast", "$state", "messageBusService", "videoElementService", mediaHostFactory]);

    function mediaHostFactory(cast, $state, messageBusService, videoElementService) {

        return {
            MediaHost: MediaHost
        };

        function MediaHost(url, licenseUrl, customData) {

            licenseUrl = null || licenseUrl;
            customData = null || customData;

            console.log("MediaHost url: " + url + " & licenseUrl: " + licenseUrl);

            var mediaHost = new cast.player.api.Host({
                mediaElement: videoElementService.videoElement,
                url: url,
                licenseUrl: licenseUrl,
                licenseCustomData: customData
            });

            mediaHost.onError = function (errorCode) {

                console.error("mediaHost.onError - errorCode: " + errorCode);

                messageBusService.messageBus.broadcast(JSON.stringify({
                    type: "cancel"
                    //,senderId: params.senderId //optional: for multiple senders
                }));

                $state.go("home");
            };

            return mediaHost;
        }

    }

})();

