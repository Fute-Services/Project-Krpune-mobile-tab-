/**
 * Local videos for the 3 screens that used Vimeo embeds on the web
 * (Construction, Walkthrough, Circulation Plan).
 *
 * Bundled offline (H.264 1080p, ffmpeg-optimised). construction.mp4 and
 * walkthrough.mp4 keep their AAC audio (FullScreenVideo plays them with sound +
 * native seek controls); circulation.mp4 has no audio track. Source masters live
 * in the user's Downloads; the re-encoded copies in this folder ship in the app.
 */
export const localVideos: Record<'construction' | 'walkthrough' | 'circulation', number | null> = {
  construction: require('./construction.mp4'),
  walkthrough: require('./walkthrough.mp4'),
  circulation: require('./circulation.mp4'),
};
