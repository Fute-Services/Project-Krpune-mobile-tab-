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

type Item = { title: string; url: string; type?: string };

const isVideo = (url?: string) => !!url && url.includes('.mp4');

function Media({ item, fit = 'cover' }: { item: Item; fit?: 'cover' | 'contain' }) {
  const src = resolveAsset(item.url);
  if (!src) return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  return isVideo(item.url) ? (
    <LoopingVideo source={src} contentFit={fit} />
  ) : (
    <Image source={src} style={StyleSheet.absoluteFill} resizeMode={fit} />
  );
}

export default function MobilityScreen() {
  const { isTablet } = useResponsive();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    localClient
      .get('/mobility')
      .then((res) => setItems(res.data?.data || []))
      .catch((e) => console.log('mobility error', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !items.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }

  const current = items[selected];
  const others = items.map((_, i) => i).filter((i) => i !== selected);

  return (
    <ImageBackground source={mobilityBg} style={styles.root} resizeMode="cover">
      {isTablet && <Image source={logo} style={styles.logo} resizeMode="contain" />}

      {/* Title */}
      <View style={styles.titleRow}>
        <Image source={RVector} style={styles.vector} resizeMode="contain" />
        <Text style={styles.title}>{current?.title}</Text>
        <Image source={LVector} style={styles.vector} resizeMode="contain" />
      </View>

      {/* Main media */}
      <View style={[styles.stage, isTablet ? styles.stageTablet : styles.stagePhone]}>
        <View style={styles.mediaCard}>
          <Media item={current} fit={isTablet ? 'cover' : 'contain'} />
        </View>
      </View>

      {/* Thumbnails: side (tablet) / bottom (phone) */}
      <View style={[styles.thumbs, isTablet ? styles.thumbsSide : styles.thumbsBottom]}>
        {others.map((idx) => (
          <Pressable
            key={idx}
            onPress={() => setSelected(idx)}
            style={[styles.thumb, isTablet ? styles.thumbTablet : styles.thumbPhone]}
          >
            <Media item={items[idx]} />
            <View style={styles.thumbLabelWrap}>
              <Text style={styles.thumbLabel} numberOfLines={1}>
                {items[idx].title}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      <BackButton />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1020' },
  logo: { position: 'absolute', width: 80, height: 40, top: '6%', right: '7%', zIndex: 5 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 56,
  },
  vector: { width: 64, height: 28 },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  stage: { alignItems: 'center', justifyContent: 'center' },
  stageTablet: { flex: 1, paddingHorizontal: 24 },
  stagePhone: { flex: 1, paddingHorizontal: 16 },
  mediaCard: {
    width: '92%',
    height: '86%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  thumbs: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    gap: 12,
  },
  thumbsSide: { position: 'absolute', top: '30%', right: '4%', flexDirection: 'column' },
  thumbsBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  thumb: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  thumbTablet: { width: 165, height: 115 },
  thumbPhone: { flex: 1, height: 80 },
  thumbLabelWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
  },
  thumbLabel: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
