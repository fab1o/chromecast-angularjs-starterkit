/**
 * Manages the media casting
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var serviceId = "mediaManagerService";

    app.service(serviceId,
        ["cast", "$state", "$rootScope", "castReceiverManagerService", "videoElementService",
            "mediaPlayerFactory", "mediaHostFactory", "mediaProtocolFactory", mediaManagerService]);

    function mediaManagerService(cast, $state, $rootScope, castReceiverManagerService, videoElementService,
                                 mediaPlayerFactory, mediaHostFactory, mediaProtocolFactory) {

        this.mediaManager = null;
        this.mediaPlayer = null;

        var self = this;

        this.init = function () {

            videoElementService.init();

            if (this.mediaManager != null) {
                return false;
            }

            console.log(serviceId + ".init");

            this.mediaManager = new cast.receiver.MediaManager(videoElementService.videoElement);

            this.mediaManager["onErrorOrig"] = this.mediaManager.onError;
            this.mediaManager["onEndedOrig"] = this.mediaManager.onEnded;
            this.mediaManager["onLoadMetadataErrorOrig"] = this.mediaManager.onLoadMetadataError;
            this.mediaManager["onMetadataLoadedOrig"] = this.mediaManager.onMetadataLoaded;
            this.mediaManager["onPauseOrig"] = this.mediaManager.onPause;
            this.mediaManager["onPlayOrig"] = this.mediaManager.onPlay;
            this.mediaManager["onSeekOrig"] = this.mediaManager.onSeek;
            this.mediaManager["onStopOrig"] = this.mediaManager.onStop;

            this.mediaManager.onError = function (e) {
                this["onErrorOrig"](e);

                console.log("mediaManager.onError");

                if (self.mediaPlayer != null) {
                    self.mediaPlayer.unload();
                }

                goHome({
                    msg: "going home because the mediaManager threw an error"
                });
            };

            this.mediaManager.onLoadMetadataError = function (e) {
                this["onLoadMetadataErrorOrig"](e);

                console.log("mediaManager.onLoadMetadataError");

                goHome({
                    msg: "going home because the mediaManager threw a loadMetadataError"
                });
            };

            this.mediaManager.onMetadataLoaded = function (e) {
                this["onMetadataLoadedOrig"](e);

                console.log("$state.go(\"player\") from mediaManager.onMetadataLoaded");

                $rootScope.$broadcast("$loadingEnd");

                $state.go("player");
            };

            this.load();

            return true;
        };

        this.load = function () {

            console.log(serviceId + ".load");

            this.mediaManager.onStop = function (e) {
                this["onStopOrig"](e);

                console.log("mediaManager.onStop");

                goHome({
                    msg: "going home because the mediaManager has stopped"
                });

            };

            this.mediaManager.onEnded = function (e) {
                this["onEndedOrig"](e);

                console.log("mediaManager.onEnded");

                goHome({
                    msg: "going home because the mediaManager has ended"
                });

            };

            this.mediaManager.onLoad = function (e) {

                console.log("mediaManager.onLoad");

                $rootScope.$broadcast("$loadingBegin");

                var resumePoint = 0;

                if (e.data.customData)
                    resumePoint = e.data.customData.resumePoint || 0;

                var mediaHost = new mediaHostFactory.MediaHost(e.data.media.contentId, resumePoint);

                var mediaProtocol = new mediaProtocolFactory.MediaProtocol(mediaHost);

                self.mediaPlayer = new mediaPlayerFactory.MediaPlayer(mediaHost, mediaProtocol, resumePoint);
            }

        };

        function goHome(options) {

            options = options || {
                    msg: ""
                };

            castReceiverManagerService.manager.setApplicationState("");

            console.log(options.msg);

            $rootScope.$broadcast("$loadingReset");

            $state.go("home");
        }

        mediaManagerService.prototype = {

            get mediaPlayer () {

                return this._mediaPlayer;
            },

            set mediaPlayer(value) {

                if (this._mediaPlayer != null) // Ensure unload before loading again
                    this._mediaPlayer.unload();


                this._mediaPlayer = value;
            }

        };

        return this;
    }

})();
