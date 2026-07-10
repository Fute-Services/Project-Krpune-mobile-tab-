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

import bgImage from '../assets/Overviewnew/Concept summarynew.png';
import circle from '../assets/Overviewnew/suscircle.png';
import building from '../assets/Overviewnew/conceptsummarybuilding.png';

const conceptData = [
  {
    id: 1,
    title: 'Superstructure',
    para: 'The building is designed on graded land with roughly 8m gradient west to east. It houses 8 levels of parking, an amenity floor and Ist to 17th floors of offices with terrace above having mechanical areas, elevator access for roof top recreational areas.',
  },
  {
    id: 2,
    title: 'Tenant Office ',
    para: 'Tenant offices are located in Ist to 17th floor in both the towers T1 as well as T2.',
  },
  {
    id: 3,
    title: 'Refuge Area',
    para: 'Refuge areas are designed on 1st, 5th, 9th and 13th level, in compliance with Indian national code. Refuge areas are accessible from the road on South side.',
  },
  {
    id: 4,
    title: ' Office Lobbies',
    para: 'A public entrance hall is designed on Lower Ground level for Tl and Upper Ground floor for T2 accessible through drop off designed on South side of the site. Each tower has its own separate lobby. ',
  },
  {
    id: 5,
    title: 'Amenities ',
    para: 'A 40000 sf. foodcourt is design opening to a large well landscaped open to sky podium garden. ',
  },
  {
    id: 6,
    title: 'Food & Beverage, Retail',
    para: 'F&B and Retail area is located on East side under T1 at Lower Ground and on South West at Upper Ground under T2.',
  },
  {
    id: 7,
    title: ' Parking',
    para: '8 parking levels starting from Lower Ground to the 6th parking podium which is design primarily as mechanical parking level.',
  },
];

export default function ConceptSummaryScreen() {
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();

  // Entrance slide-up (mirrors the web `slideAndDim` / `animate-drawer-up`).
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const riseStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 80 }],
  }));

  return (
    <ImageBackground source={bgImage} style={styles.root} resizeMode="cover">
      <Logo />

      <View style={[styles.backWrap, { top: insets.top + 8 }]}>
        <BackButton to="Overview" />
      </View>

      {/* Decorative building + circle (bottom-left) */}
      <Animated.View style={[styles.buildingWrap, riseStyle]} pointerEvents="none">
        <Image source={circle} style={styles.circle} resizeMode="contain" />
        <Image source={building} style={styles.building} resizeMode="contain" />
      </Animated.View>

      {/* Content drawer (right side) */}
      <Animated.View
        style={[
          styles.drawer,
          isTablet ? styles.drawerTablet : styles.drawerPhone,
          { top: insets.top + 56 },
          riseStyle,
        ]}
      >
        <Text style={[styles.heading, isTablet && styles.headingTablet]}>Superstructure</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          {conceptData.map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={[styles.itemTitle, isTablet && styles.itemTitleTablet]}>
                {item.title}
              </Text>
              <Text style={[styles.itemPara, isTablet && styles.itemParaTablet]}>{item.para}</Text>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a2647' },
  backWrap: { position: 'absolute', left: 20, zIndex: 50 },
  buildingWrap: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '68%',
    height: '90%',
    zIndex: 1,
  },
  circle: {
    position: 'absolute',
    width: 180,
    height: 180,
    top: '20%',
    left: 10,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    left: -20,
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
  drawer: {
    position: 'absolute',
    zIndex: 20,
  },
  drawerPhone: { right: 10, width: '44%', bottom: 16 },
  drawerTablet: { right: 40, width: '40%', bottom: 40 },
  heading: {
    color: '#eaf6ff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  headingTablet: { fontSize: 32 },
  item: { marginBottom: 6 },
  itemTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  itemTitleTablet: { fontSize: 16 },
  itemPara: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 9,
    lineHeight: 13,
  },
  itemParaTablet: { fontSize: 13, lineHeight: 18 },
});
