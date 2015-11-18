/**
 * Player controller
 * @author Fabio Costa
 */
(function () {
    "use strict";

    var controllerId = "playerController";

    app.controller(controllerId, ["$scope", "$interval", "videoElementService", "mediaManagerService", playerController]);

    function playerController ($scope, $interval, videoElementService, mediaManagerService) {

        $scope.model = this;

        this.videoElement = videoElementService.videoElement;

        this.seeking = true;
        this.paused = false;
        this.playing = false;

        var self = this;

        this.videoElement.onplaying = function () { //when video starts playing no matter user interaction

            console.log("videoElement.onplaying");

            $scope.$apply(function () {
                self.paused = false;
                self.playing = true;
                self.seeking = false;

                logStatus();
            });

            startCheckStateInterval();
        };

        this.videoElement.onwaiting = function () { //when user seeks and then pauses at the same time

            console.log("videoElement.onwaiting");

            $scope.$apply(function () {
                self.playing = false;
                self.seeking = true;

                logStatus();
            });
        };

        this.videoElement.onseeked = function () { //when user pauses and then seeks at the same time

            console.log("videoElement.onseeked");

            if (self.paused) {
                $scope.$apply(function () {
                    self.seeking = false;

                    logStatus();
                });
            }

        };

        this.videoElement.onstalled = function () {

            console.log("videoElement.onstalled");

            if (self.playing && !self.paused) {
                $scope.$apply(function () {
                    self.playing = false;
                    self.seeking = true;

                    logStatus();
                });
            }

        };

        mediaManagerService.mediaManager.onPlay = function (e) { //when user sends resumes command

            console.log("mediaManager.onPlay");

            $scope.$apply(function () {
                self.paused = false;

                logStatus();
            });

            this["onPlayOrig"](e);
        };

        mediaManagerService.mediaManager.onPause = function (e) {  //when user sends pause command

            console.log("mediaManager.onPause");

            if (self.checkStateIntervalId) {
                $interval.cancel(self.checkStateIntervalId);
                self.checkStateIntervalId = null;
            }

            $scope.$apply(function () {
                self.playing = false;
                self.paused = true;
            });

            logStatus();

            this["onPauseOrig"](e);
        };

        mediaManagerService.mediaManager.onSeek = function (e) { //when user sends seek command

            console.log("mediaManager.onSeek");
            if (self.checkStateIntervalId) {
                $interval.cancel(self.checkStateIntervalId);
                self.checkStateIntervalId = null;
            }

            $scope.$apply(function () {
                self.minimizeControls = false;
                self.playing = false;
                self.seeking = true;
                self.progressTime = e.data.currentTime;
            });

            logStatus();

            this["onSeekOrig"](e);
        };

        function startCheckStateInterval () {

            if (self.checkStateIntervalId == null) {

                self.checkStateIntervalId = $interval(function () {
                    if ((!self.playing || self.seeking) && self.videoElement.readyState == 4) {
                        self.paused = false;
                        self.playing = true;
                        self.seeking = false;
                    }
                }, 50);

            }

        }

        function logStatus(){

            console.log("player.paused: " + self.paused + " - player.playing: " + self.playing + " - player.seeking: " + self.seeking);

        }

        $scope.$on("$destroy", function () {
            console.log(controllerId + ".$destroy");

            if (self.checkStateIntervalId) {
                $interval.cancel(self.checkStateIntervalId);
                self.checkStateIntervalId = null;
            }
        });

    }

})();