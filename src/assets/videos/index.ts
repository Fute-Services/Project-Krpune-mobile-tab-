/**
 * Local videos for the 3 screens that used Vimeo embeds on the web
 * (Construction, Walkthrough, Circulation Plan).
 *
 * Bundled offline (H.264 1080p, ffmpeg-optimised, audio stripped — the player is
 * always muted). Source masters live in the user's Downloads; the re-encoded
 * copies in this folder are what ship in the app.
 */
export const localVideos: Record<'construction' | 'walkthrough' | 'circulation', number | null> = {
  construction: require('./construction.mp4'),
  walkthrough: require('./walkthrough.mp4'),
  circulation: require('./circulation.mp4'),
};
