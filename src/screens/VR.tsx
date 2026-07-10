import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PanoramaViewer from '../panorama/PanoramaViewer';
import { useResponsive } from '../theme/responsive';
import vrTour from '../offline/data/vr-tour.json';

type Scene = { id: string; label: string; panorama: string };

export default function VRScreen() {
  const insets = useSafeAreaInsets();
  const { isPhone } = useResponsive();

  const scenes: Scene[] = useMemo(() => {
    const raw = (vrTour as any).scenes || {};
    return Object.entries(raw).map(([id, v]: [string, any]) => ({
      id,
      label: v?.hotSpots?.[0]?.createTooltipArgs?.text || id,
      panorama: v?.panorama,
    }));
  }, []);

  const firstId = (vrTour as any).default?.firstScene;
  const startIndex = Math.max(0, scenes.findIndex((s) => s.id === firstId));
  const [index, setIndex] = useState(startIndex < 0 ? 0 : startIndex);

  if (!scenes.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>VR tour unavailable</Text>
      </View>
    );
  }

  const current = scenes[Math.min(index, scenes.length - 1)];

  return (
    <View style={styles.root}>
      <PanoramaViewer imageUrl={current.panorama} style={StyleSheet.absoluteFill as any} />

      <View style={[styles.titleWrap, { top: insets.top + 10 }]} pointerEvents="none">
        <Text style={styles.title}>Virtual Tour</Text>
        <Text style={styles.sceneName}>{current.label}</Text>
      </View>

      {/* On phone the global BottomBar nav sits at the bottom-centre, so lift the
          scene switcher above it; tablet uses the left rail, leaving the bottom free. */}
      <View style={[styles.switcher, { bottom: insets.bottom + (isPhone ? 88 : 20) }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {scenes.map((s, i) => {
            const active = i === index;
            return (
              <Pressable key={s.id} onPress={() => setIndex(i)} style={[styles.pill, active && styles.pillActive]}>
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{s.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  msg: { color: 'white' },
  titleWrap: { position: 'absolute', alignSelf: 'center', alignItems: 'center' },
  title: { color: 'white', fontSize: 18, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' },
  sceneName: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  switcher: { position: 'absolute', left: 0, right: 0 },
  row: { paddingHorizontal: 16, gap: 10, alignItems: 'center' },
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
