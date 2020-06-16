/**
 * Description:
 * Intercepts user agent headers
 */

console.log("Scripts::Running script video_info_interceptor.js");

function VideoInfoInterceptor() {
    this.TAG = 'VideoInfoInterceptor';
    this.VIDEO_INFO_URL = '/get_video_info?';
    this.shouldIntercept = true;

    this.modifyOpen = function(rawArgs) {
        if (window.VideoStatsWatcherAddon.recentVideoData) {
            var url = rawArgs[1];

            if (url && url.indexOf(this.VIDEO_INFO_URL) >= 0) {
                switch (window.VideoStatsWatcherAddon.recentVideoData.type) {
                    case window.VideoStatsWatcherAddon.VIDEO_TYPE_DEFAULT:
                    case window.VideoStatsWatcherAddon.VIDEO_TYPE_UNDEFINED: // video launched from suggestions
                        Log.d(this.TAG, "Fix age restrictions... " + url);

                        if (YouTubeUtils.isRestrictedVideo(window.VideoStatsWatcherAddon.recentVideoData)) {
                            // unlock age restricted videos but locks some streams (use carefully!!!)
                            url = url.replace("&el=leanback", "");
                        }

                        break;
                    case window.VideoStatsWatcherAddon.VIDEO_TYPE_LIVE:
                    case window.VideoStatsWatcherAddon.VIDEO_TYPE_UPCOMING:
                        // stream unlocking should happening in ExoInterceptor.java
                        // otherwise you'll get playback errors in youtube
                        //url = url.replace("&c=TVHTML5", "&c=HTML5");
                        break;
                }

                rawArgs[1] = url;
            }
        }
    };
}