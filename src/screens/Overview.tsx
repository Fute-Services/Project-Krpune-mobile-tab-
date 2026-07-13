import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useResponsive } from '../theme/responsive';
import { navigate } from '../navigation/navigationRef';
import Logo from '../components/Overview/Logo';
import BackButton from '../components/Overview/BackButton';
import BottomNavbar from '../components/Overview/BottomNavbar';

import bgImage from '../assets/Overviewnew/About us.png';

const INTRO =
  'Commerzone Baner shall be a premier Grade A commercial development strategically located in the thriving business hub of Baner, (West) Pune. Positioned across key commercial markets, it offers seamless connectivity and excellent access to major business districts, residential zones, and social infrastructure.';

const MORE = [
  'Designed to cater to the needs of modern enterprises, the IT park fosters a vibrant, community-driven ecosystem that supports innovation, collaboration, and growth.',
  'Whether you’re a multinational corporation or a dynamic homegrown enterprise, Commerzone Baner offers a future-ready workplace that aligns with the aspirations of “new age businesses” making it a preferred destination in Pune.',
];

export default function OverviewScreen() {
  const { isTablet } = useResponsive();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <ImageBackground
      source={bgImage}
      style={styles.root}
      resizeMode={isTablet ? 'cover' : 'contain'}
    >
      <Logo />

      {/* ── Glassmorphism Card ── */}
      <View
        style={[
          styles.card,
          isTablet ? styles.cardTablet : styles.cardPhone,
          !isTablet && { top: '50%', transform: [{ translateY: -160 }] },
          isTablet && { top: insets.top + 32 },
        ]}
      >
        {/* Header row */}
        <View style={styles.headerRow}>
          <BackButton to="ProjectDetails" />
          <Text style={[styles.title, isTablet && styles.titleTablet]}>
            Project Details
          </Text>
        </View>

        {/* Body */}
        <ScrollView
          style={styles.body}
          contentContainerStyle={{ paddingBottom: 4 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.para, isTablet && styles.paraTablet]}>{INTRO}</Text>

          {isExpanded &&
            MORE.map((p, i) => (
              <Text
                key={i}
                style={[styles.para, isTablet && styles.paraTablet, { marginTop: 8 }]}
              >
                {p}
              </Text>
            ))}
        </ScrollView>

        {/* Toggle button */}
        <Pressable
          onPress={() => setIsExpanded((v) => !v)}
          style={({ pressed }) => [
            styles.toggle,
            pressed && { transform: [{ scale: 0.96 }] },
          ]}
        >
          <Text style={styles.toggleText}>
            {isExpanded ? '▲  Show Less' : 'See More  ▼'}
          </Text>
        </Pressable>
      </View>

      {/* Bottom navbar */}
      <View style={[styles.navbarWrap, { bottom: insets.bottom + 16 }]}>
        <BottomNavbar />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#eff6ff' },
  card: {
    position: 'absolute',
    borderRadius: 16,
    overflow: 'hidden',
    // Solid-ish dark glass so the copy stays readable over the bright building
    // render behind it (the old 10%-opacity fill let the text bleed into the image).
    backgroundColor: 'rgba(8,22,48,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },
  cardPhone: { left: 12, width: '55%', maxHeight: 320, padding: 10 },
  cardTablet: { left: 32, width: 460, maxHeight: 520, padding: 28 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    flexShrink: 1,
  },
  titleTablet: { fontSize: 30 },
  body: { flexGrow: 0 },
  para: {
    color: '#fff',
    fontSize: 9,
    lineHeight: 13,
  },
  paraTablet: { fontSize: 14, lineHeight: 21 },
  toggle: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#407BB6',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  toggleText: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  navbarWrap: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 30,
  },
});
