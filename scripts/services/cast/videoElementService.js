/**
 * Manages the video element
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "videoElementService";

    app.service(serviceId, ["$state", videoElementService]);

    function videoElementService($state) {

        this.videoElement = null;

        this.init = function () {

            if (this.videoElement != null)
                return false;

            console.log(serviceId + ".init");

            this.videoElement = document.createElement("video");
            this.videoElement.autoplay = true;

            this.videoElement.setAttribute("id", "videoElement");
            this.videoElement.setAttribute("class", "media-player");
            this.videoElement.setAttribute("autoplay", "true");

            this.videoElement.onerror = function () {

                console.log("videoElement.onerror");
                console.log("going home because the videoElement threw an error");

                $state.go("home");
            };

            return true;
        };

        return this;

    }
})();
