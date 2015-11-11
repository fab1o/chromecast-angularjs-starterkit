/**
 * Manages the media player
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "mediaPlayerFactory";

    app.service(serviceId, ["cast", mediaPlayerFactory]);

    function mediaPlayerFactory(cast) {

        return {
            MediaPlayer: MediaPlayer
        };

        function MediaPlayer (mediaHost, mediaProtocol, resumePointInSeconds) {

            resumePointInSeconds = resumePointInSeconds || 0;

            var mediaPlayer = new cast.player.api.Player(mediaHost);

            mediaPlayer.load(mediaProtocol, resumePointInSeconds);

            console.log("mediaPlayer initialized with resumePointInSeconds: " + resumePointInSeconds);

            return mediaPlayer;
        }

    }

})();

