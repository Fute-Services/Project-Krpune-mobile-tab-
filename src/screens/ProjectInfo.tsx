import { useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../theme/responsive';
import BackButton from '../components/BackButton';

import info1 from '../assets/info1.png';
import info2 from '../assets/info2.png';
import info3 from '../assets/info3.png';

const ANIM_DURATION = 1400;

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function ProjectInfoScreen() {
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  // Entrance animations mirroring the web framer-motion variants:
  //   topDown (y: -150 → 0), leftIn (x: -300 → 0), rightIn (x: 300 → 0)
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: ANIM_DURATION, easing: Easing.out(Easing.cubic) });
  }, [p]);

  const topDown = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * -150 }],
  }));
  const leftIn = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateX: (1 - p.value) * -300 }],
  }));
  const rightIn = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateX: (1 - p.value) * 300 }],
  }));

  return (
    <View style={styles.root}>
      <View style={[styles.backWrap, { top: insets.top + 8 }]}>
        <BackButton />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inner, isTablet && styles.innerTablet]}>
          {/* TOP SECTION */}
          <Animated.View style={[styles.topSection, topDown]}>
            <Text style={styles.topPara}>
              Spread across <Text style={styles.bold}>9 acres</Text>, this premium commercial
              development offers approximately <Text style={styles.bold}>2.7 million sq. ft.</Text> of
              leasable area, designed to meet the evolving needs of modern IT/ITES enterprises. The
              campus features state-of-the-art office spaces with a strong emphasis on flexibility,
              efficiency, and workplace innovation. Designed as a green building campus, it is LEED
              Gold certified (Core & Shell), ensuring sustainability, energy efficiency, and a
              superior working environment.
            </Text>
          </Animated.View>

          {/* Strategic Location */}
          <Animated.View style={[styles.block, leftIn]}>
            <Image source={info1} style={styles.circleImgSm} />
            <View style={styles.blockBody}>
              <View style={styles.headerRow}>
                <Text style={styles.h2}>Strategic Location</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.bracket}>
                <Text style={styles.para}>
                  Situated in one of Pune's fastest-growing IT and automobile corridors, the site
                  offers excellent connectivity and accessibility:
                </Text>
                <Bullet>Direct access via a service road off the Mumbai-Pune Highway</Bullet>
                <Bullet>Additional access from a wide parallel road, ensuring smooth traffic flow</Bullet>
                <Bullet>Prominent highway frontage enhancing visibility and accessibility</Bullet>
              </View>
            </View>
          </Animated.View>

          {/* Connectivity */}
          <Animated.View style={[styles.block, leftIn]}>
            <Image source={info2} style={styles.circleImgMd} />
            <View style={styles.blockBody}>
              <View style={styles.headerRow}>
                <Text style={styles.h2}>Connectivity</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.bracket}>
                <View style={styles.kmRow}>
                  <Text style={styles.para}>Pune Airport –</Text>
                  <Text style={styles.kmValue}>
                    17 km <Text style={styles.kmSub}>(~40 minutes)</Text>
                  </Text>
                </View>
                <View style={styles.kmRow}>
                  <Text style={styles.para}>Pune Railway Station –</Text>
                  <Text style={styles.kmValue}>
                    11 km <Text style={styles.kmSub}>(~30 minutes)</Text>
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Design Excellence */}
          <Animated.View style={[styles.block, rightIn]}>
            <Image source={info3} style={styles.circleImgLg} />
            <View style={styles.blockBody}>
              <View style={styles.headerRow}>
                <Text style={styles.h2}>Design Excellence</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.bracket}>
                <Text style={styles.para}>
                  The project is thoughtfully planned to deliver maximum efficiency and user comfort:
                </Text>
                <Bullet>Optimized core design to enhance internal space utilization</Bullet>
                <Bullet>Efficient vertical transportation systems for seamless movement</Bullet>
                <Bullet>Maximized usable office areas for superior workplace layouts</Bullet>
                <Bullet>Integrated recreational and office spaces to support employee well-being</Bullet>
                <Bullet>Optimized floor plates for flexibility and better space utility</Bullet>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#062442' },
  backWrap: { position: 'absolute', left: 16, zIndex: 50 },
  content: { paddingHorizontal: 20 },
  inner: { width: '100%', alignSelf: 'center' },
  innerTablet: { maxWidth: 900 },
  topSection: { marginBottom: 28, alignItems: 'center' },
  topPara: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  bold: { fontWeight: '700', fontSize: 17 },
  block: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    marginBottom: 40,
  },
  blockBody: { width: '100%' },
  circleImgSm: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleImgMd: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleImgLg: {
    width: 224,
    height: 224,
    borderRadius: 112,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    justifyContent: 'center',
  },
  h2: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(59,130,246,0.5)',
  },
  bracket: {
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(59,130,246,0.4)',
    paddingVertical: 16,
    paddingLeft: 18,
    paddingRight: 12,
  },
  para: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 6,
  },
  bulletRow: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { color: '#fff', fontSize: 13, marginRight: 8, lineHeight: 19 },
  bulletText: { color: '#fff', fontSize: 13, lineHeight: 19, flex: 1 },
  kmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 350,
    marginBottom: 12,
  },
  kmValue: { color: '#fff', fontWeight: '700', fontSize: 18 },
  kmSub: { color: '#fff', fontWeight: '400', fontSize: 12 },
});
