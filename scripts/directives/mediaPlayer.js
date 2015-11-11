/**
 * Media Player directive
 * @author Fabio Costa
 */
(function () {
    "use strict";

    app.directive("mediaPlayer", ["videoElementService", function (videoElementService) {
        return {
            restrict : "E", link : function (scope, elem) {

                elem.append(videoElementService.videoElement);
            }
        };

    }]);

})();