import { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../theme/responsive';
import Logo from '../components/Overview/Logo';
import BackButton from '../components/Overview/BackButton';

import bgImage from '../assets/Overviewnew/Sustainability.png';
import circle from '../assets/Overviewnew/suscircle.png';
import building from '../assets/Overviewnew/sustainabilitybuilding.png';
import tree from '../assets/Overviewnew/sustree.png';

const data = [
  {
    id: 1,
    title: ' Water Conservation',
    para: [
      'Recycling & Reuse of water. ',
      'Storage, Recharge & Use of Rainwater. ',
      'Low Flow water efficient fixtures.',
    ],
  },
  {
    id: 2,
    title: ' Energy Conservation',
    para: [
      'LED High efficiency light fixtures in common areas.',
      'Energy efficient motors for mechanical equipment. ',
      'High COP chillers.',
      'Use of Low Global Warming Potential (LGWP) refrigent.',
      'Variable Frequency Drive on motors.',
    ],
  },
  {
    id: 3,
    title: ' Other Initiatives',
    para: [
      'High efficiency double glazed envelope.',
      'Installation of Energy recovery systems. ',
      'Below grade parking with Co sensors.',
    ],
  },
];

export default function SustainabilityScreen() {
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  // Entrance slide-up (mirrors the web `slideUpDrawer` / `animate-drawer-up`).
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const riseStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 80 }],
  }));

  return (
    <ImageBackground source={bgImage} style={styles.root} resizeMode="cover">
      <Logo />

      <View style={[styles.backWrap, { top: insets.top + 12 }]}>
        <BackButton to="Overview" />
      </View>

      {/* Decorative circle + building + tree (bottom-left) */}
      <Animated.View style={[styles.artWrap, riseStyle]} pointerEvents="none">
        <Image source={circle} style={styles.circle} resizeMode="contain" />
        <Image source={building} style={styles.building} resizeMode="contain" />
        <Image source={tree} style={styles.tree} resizeMode="contain" />
      </Animated.View>

      {/* Content overlay (right side) */}
      <Animated.View
        style={[
          styles.overlay,
          isTablet ? styles.overlayTablet : styles.overlayPhone,
          { top: insets.top + 40 },
          riseStyle,
        ]}
      >
        <Text style={[styles.heading, isTablet && styles.headingTablet]}>
          Sustainability Initiatives
        </Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {data.map((item) => (
            <View key={item.id} style={styles.section}>
              <Text style={[styles.sectionTitle, isTablet && styles.sectionTitleTablet]}>
                {item.title}
              </Text>
              <View style={styles.bullets}>
                {item.para.map((text, i) => (
                  <Text key={i} style={[styles.bullet, isTablet && styles.bulletTablet]}>
                    {text}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a2647' },
  backWrap: { position: 'absolute', left: 24, zIndex: 50 },
  artWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '85%',
    height: '80%',
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    left: 5,
    bottom: 0,
    width: 120,
    height: 120,
  },
  building: {
    position: 'absolute',
    left: 5,
    bottom: 0,
    width: '80%',
    height: '80%',
    zIndex: 2,
  },
  tree: {
    position: 'absolute',
    left: '58%',
    bottom: 20,
    width: '45%',
    height: '55%',
    zIndex: 3,
  },
  overlay: {
    position: 'absolute',
    zIndex: 20,
  },
  overlayPhone: { right: 8, width: '42%', bottom: 16 },
  overlayTablet: { right: 32, width: '40%', bottom: 40 },
  heading: {
    color: '#eaf6ff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  headingTablet: { fontSize: 32 },
  section: { marginBottom: 8 },
  sectionTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  sectionTitleTablet: { fontSize: 20 },
  bullets: { opacity: 0.9 },
  bullet: {
    color: '#fff',
    fontSize: 9,
    lineHeight: 12,
  },
  bulletTablet: { fontSize: 14, lineHeight: 20 },
});
