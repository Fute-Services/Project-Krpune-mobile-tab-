import { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { AssetSource } from '../offline/resolveAsset';

/**
 * Autoplaying, muted, looping video — the native equivalent of the web app's
 * <video autoPlay muted loop playsInline>. Accepts a bundled require() id or a
 * { uri } source (offline-first via resolveAsset()).
 */
export default function LoopingVideo({
  source,
  style,
  contentFit = 'cover',
}: {
  source: AssetSource;
  style?: ViewStyle | ViewStyle[];
  contentFit?: 'cover' | 'contain' | 'fill';
}) {
  const player = useVideoPlayer(source as any, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // Ensure it keeps playing when the source swaps.
  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <VideoView
      player={player}
      style={[styles.fill, style]}
      contentFit={contentFit}
      nativeControls={false}
    />
  );
}

const styles = StyleSheet.create({ fill: { width: '100%', height: '100%' } });
