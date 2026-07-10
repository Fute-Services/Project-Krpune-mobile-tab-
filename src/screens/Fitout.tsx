import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import { useResponsive } from '../theme/responsive';

import fitoutPlan from '../assets/fitout/img.png';
import logo from '../assets/logo.png';
import boardRoomIcon from '../assets/fitout/Group 161.png';
import ahuIcon from '../assets/fitout/Group 163.png';

type LegendItem = {
  name: string;
  // When set, render the bundled png icon; otherwise a colored dot bullet
  // (the web used react-icons/md, which isn't available in the native app).
  iconImage?: number;
};

const LEGEND_ITEMS: LegendItem[] = [
  { name: 'Linear Workstation' },
  { name: '4 Seater Meeting Room' },
  { name: '8 Seater Meeting Room' },
  { name: '10 Seater Meeting Room' },
  { name: '16 Seater Meeting Room' },
  { name: 'Board Room', iconImage: boardRoomIcon },
  { name: 'Fire Escape Staircase' },
  { name: 'Ladies Rest Room' },
  { name: 'Gents Rest Room' },
  { name: 'AHU Room', iconImage: ahuIcon },
];

export default function FitoutScreen() {
  const { isTablet } = useResponsive();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.root}>
      <LinearGradient
        colors={['#15457a', '#061c36']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Top-right branding */}
      <Image source={logo} style={styles.logo} resizeMode="contain" />

      <View style={[styles.content, isTablet ? styles.contentTablet : styles.contentPhone]}>
        {/* Legend panel */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={[styles.legend, isTablet ? styles.legendTablet : styles.legendPhone]}
        >
          <View style={styles.legendHeader}>
            <Text style={styles.legendHeaderText}>LEGEND / DESCRIPTION</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.legendList}>
            {LEGEND_ITEMS.map((item) => (
              <View key={item.name} style={styles.legendRow}>
                {item.iconImage ? (
                  <View style={styles.iconCircle}>
                    <Image source={item.iconImage} style={styles.iconImg} resizeMode="contain" />
                  </View>
                ) : (
                  <View style={styles.iconCircle}>
                    <View style={styles.dot} />
                  </View>
                )}
                <Text style={styles.legendText}>{item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* 3D fit-out plan image */}
        <Animated.Image
          entering={FadeInUp.delay(200).duration(500)}
          source={fitoutPlan}
          style={[styles.plan, isTablet ? styles.planTablet : styles.planPhone]}
          resizeMode="contain"
        />
      </View>

      {/* Bottom title */}
      <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.titleWrap}>
        <Text style={[styles.title, isTablet && styles.titleTablet]}>Fit out plan 1:60</Text>
      </Animated.View>

      <BackButton />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#061c36' },
  logo: { position: 'absolute', top: 44, right: 20, width: 60, height: 40, zIndex: 60 },

  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 90, paddingBottom: 90 },
  contentTablet: { flexDirection: 'row', gap: 24, paddingHorizontal: 24 },
  // Phone-landscape is wide but short: use a side-by-side row (legend left, plan
  // right) with tighter vertical padding so nothing overflows/clips.
  contentPhone: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 62,
  },

  // Legend
  legend: {
    backgroundColor: 'rgba(2,19,38,0.4)',
    borderWidth: 1,
    borderColor: '#2B6CA7',
    borderRadius: 24,
    padding: 16,
  },
  legendTablet: { width: 280, maxHeight: '80%' },
  legendPhone: { width: 250, maxHeight: '100%', padding: 12 },
  legendHeader: {
    backgroundColor: '#B5D3F1',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
    marginBottom: 12,
  },
  legendHeaderText: {
    color: '#0A2643',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  legendList: { gap: 12 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(43,108,167,0.8)',
    backgroundColor: '#06182C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: { width: 16, height: 16, opacity: 0.9 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#7FB4EC' },
  legendText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    flexShrink: 1,
  },

  // Plan image
  plan: { alignSelf: 'center' },
  planTablet: { width: '55%', height: '85%' },
  planPhone: { flex: 1, height: '100%' },

  // Title
  titleWrap: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' },
  title: {
    color: '#9CCBFF',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 1,
  },
  titleTablet: { fontSize: 44 },
});
