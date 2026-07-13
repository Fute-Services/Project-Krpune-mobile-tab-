import { useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import LoopingVideo from '../components/LoopingVideo';
import { resolveAsset, type AssetSource } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';

import locationLogo from '../assets/location-logo.png';

const VIDEO_URL =
  'https://res.cloudinary.com/db0f2ofgf/video/upload/v1779279990/Location_Video_wv1kbx.mp4';

type Filter = 'Social Infra' | 'Transport Infra';

type Marker = {
  label: string;
  top: number; // % of container height
  left: number; // % of container width
  image?: boolean; // render the Raheja logo instead of a text label
};

// Copied (labels + approximate % positions) from the web MapboxMap `data` map.
// Off-screen web values (left > 100%) are clamped into view for the native map.
const MARKERS: Record<Filter, Marker[]> = {
  'Social Infra': [
    { label: 'Raheja IT Park', top: 41, left: 51, image: true },
    { label: 'Manipal Hospital - 06 Mins', top: 17, left: 55 },
    { label: 'Westend Mall - 17 Mins', top: 30, left: 82 },
    { label: 'Radisson Blu - 18 Mins', top: 10, left: 6 },
    { label: 'Orchid International School - 08 Mins', top: 84, left: 20 },
    { label: 'Tip Top Hotel - 07 Mins', top: 10, left: 34 },
    { label: 'MIT World Peace University - 25 Mins', top: 86, left: 78 },
    { label: 'Puraniks Aldea Espanola - 05 Mins', top: 22, left: 30 },
  ],
  'Transport Infra': [
    { label: 'Raheja IT Park', top: 41, left: 51, image: true },
    { label: 'Mumbai - Bangalore Highway - 02 Mins', top: 78, left: 60 },
    { label: 'Dapodi Metro Station - 18 Mins', top: 20, left: 80 },
    { label: 'Pune International Airport - 40 Mins', top: 45, left: 80 },
    { label: 'Navi Mumbai Airport - 1 hr 51 Mins', top: 10, left: 6 },
  ],
};

const FILTERS: Filter[] = ['Social Infra', 'Transport Infra'];

export default function LocationScreen() {
  const { isTablet, isPhone } = useResponsive();
  const [activeFilter, setActiveFilter] = useState<Filter>('Social Infra');

  const zoom = useSharedValue(1);
  const layerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom.value }],
  }));

  const zoomIn = () => {
    zoom.value = withTiming(Math.min(zoom.value + 0.2, 2), { duration: 250 });
  };
  const zoomOut = () => {
    zoom.value = withTiming(Math.max(zoom.value - 0.2, 1), { duration: 250 });
  };
  const zoomReset = () => {
    zoom.value = withTiming(1, { duration: 250 });
  };

  const videoSrc = resolveAsset(VIDEO_URL);
  const markers = MARKERS[activeFilter];

  return (
    <View style={styles.root}>
      {/* Scene layer — the video AND the markers scale together as one unit so the
          navpoints stay pinned to the same spot on the video as you zoom. (Previously
          only the markers scaled while the video stayed put, so zooming pushed the
          navpoints away from the building they point at.) The filter pills and zoom
          controls live OUTSIDE this layer, so the UI itself never zooms. */}
      <Animated.View style={[StyleSheet.absoluteFill, layerStyle]} pointerEvents="none">
        {/* Background video (offline). */}
        {videoSrc ? (
          <LoopingVideo source={videoSrc as AssetSource} contentFit="cover" />
        ) : (
          <View style={StyleSheet.absoluteFill} />
        )}

        {/* Marker layer — full-bleed on every device so each navpoint's top/left %
            lands on the same real-world spot in the video as the web map (previously
            phone insetted the markers into a band, which compressed them toward the
            centre and pushed them off the map features they point at). */}
        <View style={StyleSheet.absoluteFill}>
          {markers.map((m) => (
            <View
              key={`${activeFilter}-${m.label}`}
              style={[styles.marker, { top: `${m.top}%`, left: `${m.left}%` }]}
            >
              {m.image ? (
                <Image
                  source={locationLogo}
                  style={[styles.markerLogo, isPhone && styles.markerLogoPhone]}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.labelPill, isPhone && styles.labelPillPhone]}>
                  <Text style={[styles.labelText, isPhone && styles.labelTextPhone]} numberOfLines={1}>
                    {m.label}
                  </Text>
                </View>
              )}
              <View style={styles.markerLine} />
              <View style={styles.markerDot} />
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Filter pills (top). */}
      <View style={styles.filtersWrap} pointerEvents="box-none">
        <View style={styles.filters}>
          {FILTERS.map((filter) => {
            const active = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                  styles.filterBtn,
                  isTablet && styles.filterBtnTablet,
                  isPhone && styles.filterBtnPhone,
                  active ? styles.filterBtnActive : styles.filterBtnIdle,
                ]}
              >
                <Text style={[styles.filterText, isPhone && styles.filterTextPhone]}>{filter}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Zoom controls (bottom-left) — lifted above the phone bottom nav bar. */}
      <View style={[styles.zoomWrap, isPhone && { bottom: 92 }]} pointerEvents="box-none">
        <LinearGradient
          colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0)']}
          style={styles.zoomGroup}
        >
          <Pressable onPress={zoomIn} style={styles.zoomBtn}>
            <Text style={styles.zoomBtnText}>+</Text>
          </Pressable>
          <Pressable onPress={zoomOut} style={styles.zoomBtn}>
            <Text style={styles.zoomBtnText}>-</Text>
          </Pressable>
        </LinearGradient>
        <Pressable onPress={zoomReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000', overflow: 'hidden' },

  // Markers
  marker: { position: 'absolute', alignItems: 'center' },
  markerLogo: { width: 90, height: 56, marginBottom: 4 },
  markerLogoPhone: { width: 60, height: 38, marginBottom: 2 },
  labelPill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 2,
  },
  labelPillPhone: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  labelText: {
    color: 'white',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  labelTextPhone: { fontSize: 9, letterSpacing: 0.3 },
  markerLine: { width: 1, height: 18, backgroundColor: 'rgba(255,255,255,0.9)' },
  markerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#000',
  },

  // Filter pills
  filtersWrap: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(42,52,65,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    maxWidth: '90%',
  },
  filterBtn: {
    minWidth: 110,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  filterBtnTablet: { minWidth: 140, paddingHorizontal: 28 },
  filterBtnPhone: { minWidth: 88, paddingHorizontal: 14, paddingVertical: 7 },
  filterBtnActive: { backgroundColor: '#4581C4', borderColor: 'white' },
  filterBtnIdle: { backgroundColor: '#485460', borderColor: 'transparent' },
  filterText: { color: 'white', fontSize: 14, fontWeight: '500' },
  filterTextPhone: { fontSize: 12 },

  // Zoom controls
  zoomWrap: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 50,
  },
  zoomGroup: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#000',
  },
  zoomBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: 'rgba(16,92,168,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomBtnText: { color: 'white', fontSize: 18, fontWeight: '600' },
  resetBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.4)',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  resetText: { color: 'white', fontSize: 13, fontWeight: '500' },
});
