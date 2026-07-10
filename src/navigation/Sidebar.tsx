import { useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigate } from './navigationRef';
import { SIDEBAR_ROUTES, type RootStackParamList } from './types';
import { useResponsive } from '../theme/responsive';

import HomeIcon from '../assets/home-icon.png';
import LocationIcon from '../assets/location.png';
import AmenitiesIcon from '../assets/sparkling.png';
import ProjectIcon from '../assets/project details.png';
import VrIcon from '../assets/vr mode.png';

type Item = { route: keyof RootStackParamList; icon: any; label: string };

const NAV_ITEMS: Item[] = [
  { route: 'Home', icon: HomeIcon, label: 'Project Overview' },
  { route: 'Location', icon: LocationIcon, label: 'Location' },
  { route: 'Amenities', icon: AmenitiesIcon, label: 'Amenities' },
  { route: 'ProjectDetails', icon: ProjectIcon, label: 'Inventory' },
  { route: 'VR', icon: VrIcon, label: 'VR' },
];

export default function Sidebar({ current }: { current?: keyof RootStackParamList }) {
  const { isPhone, scale } = useResponsive();
  const insets = useSafeAreaInsets();

  const activeIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((i) => i.route === current)
  );

  // Only render on sidebar routes (mirrors web RootLayout sidebarRoutes).
  if (!current || !SIDEBAR_ROUTES.includes(current)) return null;

  return isPhone ? (
    <BottomBar activeIndex={activeIndex} insetBottom={insets.bottom} />
  ) : (
    <LeftRail activeIndex={activeIndex} scale={scale} />
  );
}

/* ── Tablet / large: original left rail ─────────────────────────────── */
function LeftRail({ activeIndex, scale }: { activeIndex: number; scale: (n: number) => number }) {
  const ITEM_GAP = 79;
  const slider = useSharedValue(activeIndex * ITEM_GAP + 13);
  useEffect(() => {
    slider.value = withTiming(activeIndex * ITEM_GAP + 13, { duration: 450 });
  }, [activeIndex]);

  const sliderStyle = useAnimatedStyle(() => ({ top: slider.value }));

  return (
    <View style={styles.railWrap} pointerEvents="box-none">
      <LinearGradient
        colors={['#105CA847', 'rgba(6,36,66,0.55)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={styles.rail}
      >
        <Animated.View style={[styles.railSlider, sliderStyle]}>
          <LinearGradient
            colors={['#407BB6', '#76ACE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {NAV_ITEMS.map((item, i) => (
          <Pressable
            key={item.route}
            onPress={() => navigate(item.route)}
            style={styles.railItem}
          >
            <Image
              source={item.icon}
              style={{
                width: 24,
                height: 24,
                transform: [{ scale: i === activeIndex ? 1.1 : 1 }],
              }}
              tintColor="#ffffff"
              resizeMode="contain"
            />
            <Text style={styles.railLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </LinearGradient>
    </View>
  );
}

/* ── Phone: floating bottom bar ─────────────────────────────────────── */
function BottomBar({ activeIndex, insetBottom }: { activeIndex: number; insetBottom: number }) {
  return (
    <View
      style={[styles.barWrap, { bottom: Math.max(14, insetBottom + 6) }]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={['#105CA847', 'rgba(6,36,66,0.55)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.4, y: 1 }}
        style={styles.bar}
      >
        {NAV_ITEMS.map((item, i) => {
          const active = i === activeIndex;
          return (
            <Pressable key={item.route} onPress={() => navigate(item.route)} style={styles.barItem}>
              {active && <View style={styles.barPill} />}
              <Image
                source={item.icon}
                style={{ width: 20, height: 20, transform: [{ scale: active ? 1.12 : 1 }] }}
                tintColor="#ffffff"
                resizeMode="contain"
              />
              <Text style={styles.barLabel} numberOfLines={2}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  railWrap: {
    position: 'absolute',
    top: '50%',
    left: 40,
    transform: [{ translateY: -210 }],
    zIndex: 1000,
  },
  rail: {
    width: 80,
    height: 420,
    borderRadius: 20,
    alignItems: 'center',
    gap: 32,
    paddingTop: 20,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  railSlider: {
    position: 'absolute',
    left: 7,
    width: 65,
    height: 70,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
  },
  railItem: {
    width: 74,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  railLabel: {
    fontSize: 9,
    letterSpacing: 0.3,
    color: 'white',
    textAlign: 'center',
    lineHeight: 11,
    width: 72,
  },
  barWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 64,
    width: '92%',
    maxWidth: 420,
    borderRadius: 20,
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  } as any,
  barItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  barPill: {
    position: 'absolute',
    width: 58,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#5a91cc',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  barLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: 'white',
    textAlign: 'center',
    lineHeight: 10,
  },
});
