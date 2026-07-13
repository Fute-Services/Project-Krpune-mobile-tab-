import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import BackButton from './BackButton';
import { localVideos } from '../assets/videos';

/**
 * Full-screen video page used by the Construction / Walkthrough / Circulation
 * Plan screens (Vimeo embeds on the web). Unlike the muted background loops,
 * this plays with SOUND and shows native controls so the user can play/pause
 * and scrub forward/back. Shows a placeholder until the corresponding local
 * .mp4 is dropped in src/assets/videos/.
 */
export default function FullScreenVideo({
  videoKey,
  title,
}: {
  videoKey: keyof typeof localVideos;
  title: string;
}) {
  const source = localVideos[videoKey];

  const player = useVideoPlayer(source ?? null, (p) => {
    p.muted = false;
    p.loop = false;
    if (source != null) p.play();
  });

  // Keep playing when the screen (re)mounts.
  useEffect(() => {
    if (source != null) player.play();
  }, [player, source]);

  return (
    <View style={styles.root}>
      {source != null ? (
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls
          allowsFullscreen
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>Video coming soon</Text>
          <Text style={styles.hint}>
            Add {videoKey}.mp4 to src/assets/videos/ and enable it in index.ts
          </Text>
        </View>
      )}
      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05070f', alignItems: 'center', justifyContent: 'center' },
  video: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  title: { color: 'white', fontSize: 26, fontWeight: '700', letterSpacing: 1 },
  sub: { color: '#9aa4bf', fontSize: 15, marginTop: 8 },
  hint: { color: '#5b6480', fontSize: 12, marginTop: 18, textAlign: 'center' },
});
