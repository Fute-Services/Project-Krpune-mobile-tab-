import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAmenitiesScenes } from '../hooks/useAmenitiesScenes';
import PanoramaViewer from './PanoramaViewer';
import BackButton from '../components/BackButton';

/**
 * Shared amenity level screen — a 360° panorama with a scene switcher.
 * Used by Terrace / Podium / Lobby Reception / Ground level screens.
 */
export default function AmenityLevel({ slug, title }: { slug: string; title: string }) {
  const { scenes, loading } = useAmenitiesScenes(slug);
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }
  if (!scenes.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No scenes available</Text>
        <BackButton to="Amenities" />
      </View>
    );
  }

  const current = scenes[Math.min(index, scenes.length - 1)];

  return (
    <View style={styles.root}>
      <PanoramaViewer imageUrl={current.imageUrl} style={styles.pano} />

      {/* Title badge */}
      <View style={[styles.titleWrap, { top: insets.top + 10 }]} pointerEvents="none">
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sceneName}>{current.label}</Text>
      </View>

      {/* Scene switcher */}
      <View style={[styles.switcher, { bottom: insets.bottom + 20 }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.switcherContent}
        >
          {scenes.map((s, i) => {
            const active = i === index;
            return (
              <Pressable
                key={s.id}
                onPress={() => setIndex(i)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <BackButton to="Amenities" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  pano: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  msg: { color: 'white', marginBottom: 20 },
  titleWrap: { position: 'absolute', alignSelf: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 18, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  sceneName: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  switcher: { position: 'absolute', left: 0, right: 0 },
  switcherContent: { paddingHorizontal: 16, gap: 10, alignItems: 'center' },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(16,60,120,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillActive: { backgroundColor: 'rgba(94,191,233,0.85)' },
  pillText: { color: 'white', fontSize: 12, fontWeight: '600' },
  pillTextActive: { color: '#04263f' },
});
