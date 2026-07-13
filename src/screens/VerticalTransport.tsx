import { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, ImageBackground } from 'react-native';
import localClient from '../api/localClient';
import { resolveAsset } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';
import BackButton from '../components/BackButton';
import LoopingVideo from '../components/LoopingVideo';

import mobilityBg from '../assets/mobility/mobility.jpeg';
import logo from '../assets/logo.png';
import RVector from '../assets/mobility/Vector-right.png';
import LVector from '../assets/mobility/Vector-left.png';

type Transport = { _id: string; id?: string | number; label: string; video: string };

export default function VerticalTransportScreen() {
  const { isTablet } = useResponsive();
  const [sections, setSections] = useState<Transport[]>([]);
  const [active, setActive] = useState<Transport | null>(null);

  useEffect(() => {
    localClient
      .get('/transport')
      .then((res) => {
        const data: Transport[] = res.data?.data || [];
        setSections(data);
        setActive(data[0] ?? null);
      })
      .catch((e) => console.log('transport error', e));
  }, []);

  if (!active) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }

  const videoSrc = resolveAsset(active.video);

  return (
    <ImageBackground source={mobilityBg} style={styles.root} resizeMode="cover">
      <Image source={logo} style={[styles.logo, !isTablet && styles.logoPhone]} resizeMode="contain" />

      {/* Title */}
      <View style={[styles.titleRow, !isTablet && styles.titleRowPhone]}>
        <Image source={RVector} style={[styles.vector, !isTablet && styles.vectorPhone]} resizeMode="contain" />
        <Text style={[styles.title, !isTablet && styles.titlePhone]}>{active.label}</Text>
        <Image source={LVector} style={[styles.vector, !isTablet && styles.vectorPhone]} resizeMode="contain" />
      </View>

      {isTablet ? (
        /* Tablet: video centered, buttons on the right */
        <View style={styles.tabletRow}>
          <View style={styles.tabletVideoWrap}>
            <View style={styles.videoCard}>
              {videoSrc && <LoopingVideo source={videoSrc} contentFit="cover" />}
            </View>
          </View>
          <View style={styles.sideButtons}>
            {sections.map((s) => (
              <SectionButton
                key={s._id}
                label={s.label}
                active={s._id === active._id}
                onPress={() => setActive(s)}
                variant="pill"
              />
            ))}
          </View>
        </View>
      ) : (
        /* Phone: buttons stacked on the left, image/video on the right (fills the
           wasted side space and shifts the diagram rightward). */
        <View style={styles.phoneRow}>
          <View style={styles.phoneSideButtons}>
            {sections.map((s) => (
              <SectionButton
                key={s._id}
                label={s.label}
                active={s._id === active._id}
                onPress={() => setActive(s)}
                variant="stack"
              />
            ))}
          </View>
          <View style={styles.phoneVideoArea}>
            <View style={styles.videoCardPhone}>
              {videoSrc && <LoopingVideo source={videoSrc} contentFit="contain" />}
            </View>
          </View>
        </View>
      )}

      <BackButton />
    </ImageBackground>
  );
}

function SectionButton({
  label,
  active,
  onPress,
  variant,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  variant: 'pill' | 'stack';
}) {
  const btnStyle = variant === 'pill' ? styles.pill : styles.stackBtn;
  const textStyle = variant === 'pill' ? styles.pillText : styles.stackText;
  return (
    <Pressable
      onPress={onPress}
      style={[btnStyle, { backgroundColor: active ? '#5ebfe9c0' : '#82cbece0' }]}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  logo: { position: 'absolute', width: 70, height: 40, top: 40, right: 24, zIndex: 20 },
  logoPhone: { width: 52, height: 30, top: 20, right: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 40,
    paddingBottom: 8,
    paddingHorizontal: 60,
  },
  titleRowPhone: { paddingTop: 22, gap: 10, paddingHorizontal: 40 },
  vector: { width: 56, height: 28 },
  vectorPhone: { width: 40, height: 18 },
  title: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    flexShrink: 1,
  },
  titlePhone: { fontSize: 16, letterSpacing: 2 },
  tabletRow: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, gap: 16 },
  tabletVideoWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  videoCard: {
    width: '75%',
    height: '85%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  sideButtons: { width: 240, gap: 14, justifyContent: 'center' },
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillText: { color: 'white', letterSpacing: 1, fontSize: 14 },

  // Phone: left button column + right video area.
  phoneRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  phoneSideButtons: { width: 208, gap: 10, justifyContent: 'center' },
  phoneVideoArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  videoCardPhone: {
    width: '100%',
    height: '94%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  stackBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
});
