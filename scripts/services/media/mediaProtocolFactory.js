/**
 * Manages the protocol
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "mediaProtocolFactory";

    app.factory(serviceId, ["cast", mediaProtocolFactory]);

    function mediaProtocolFactory(cast) {

        return {
            MediaProtocol: MediaProtocol
        };

        function MediaProtocol (mediaHost) {

            var protocol = null;

            if (mediaHost) {

                var url = mediaHost.url;

                if (url.lastIndexOf(".m3u8") >= 0) {

                    protocol = cast.player.api.CreateHlsStreamingProtocol(mediaHost);

                } else if (url.lastIndexOf(".mpd") >= 0) {

                    protocol = cast.player.api.CreateDashStreamingProtocol(mediaHost);

                } else if (url.lastIndexOf(".ism/") >= 0 || url.lastIndexOf(".isml/") >= 0) {

                    protocol = cast.player.api.CreateSmoothStreamingProtocol(mediaHost);
                }
            }

            return protocol;
        }

    }

})();

