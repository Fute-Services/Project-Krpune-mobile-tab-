import { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import localClient from '../api/localClient';
import { resolveAsset } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';
import BackButton from '../components/BackButton';

type GalleryImage = { url?: string; image?: string; title?: string };
type GalleryCategory = { category: string; images: GalleryImage[] };

function srcOf(item: GalleryImage) {
  return resolveAsset(item.url || item.image);
}

export default function GalleryScreen() {
  const { isTablet } = useResponsive();
  const { width } = useWindowDimensions();

  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [viewMode, setViewMode] = useState('exterior');
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localClient
      .get('/gallery')
      .then((res) => {
        const data: GalleryCategory[] = Array.isArray(res.data) ? res.data : [];
        setCategories(data);
        // Default to exterior if present, else first available category.
        if (data.length && !data.some((c) => c.category === 'exterior')) {
          setViewMode(data[0].category);
        }
      })
      .catch((e) => console.log('gallery error', e))
      .finally(() => setLoading(false));
  }, []);

  const filteredImages = useMemo(
    () => categories.find((c) => c.category === viewMode)?.images ?? [],
    [categories, viewMode],
  );

  const switchMode = (mode: string) => {
    setViewMode(mode);
    setActiveIndex(0);
  };

  const hasCategory = (c: string) => categories.some((cat) => cat.category === c);

  // Item sizing: bigger on tablet. Coverflow-like parallax neighbours peek in.
  const itemHeight = isTablet ? 460 : 320;

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Title */}
      <View style={styles.titleWrap} pointerEvents="none">
        <Text style={styles.title} numberOfLines={1}>
          {filteredImages[activeIndex]?.title || 'Gallery'}
        </Text>
        <View style={styles.titleRule} />
      </View>

      {/* Carousel */}
      <View style={styles.carouselWrap}>
        {filteredImages.length > 0 ? (
          <Carousel
            key={viewMode}
            width={width}
            height={itemHeight}
            data={filteredImages}
            loop={filteredImages.length > 2}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.86,
              parallaxScrollingOffset: isTablet ? 140 : 90,
            }}
            onSnapToItem={setActiveIndex}
            renderItem={({ item }) => {
              const src = srcOf(item);
              return (
                <View style={styles.slide}>
                  {src ? (
                    <Image source={src} style={styles.slideImage} resizeMode="cover" />
                  ) : (
                    <View style={[styles.slideImage, styles.slideFallback]} />
                  )}
                </View>
              );
            }}
          />
        ) : (
          <Text style={styles.loadingText}>No Images</Text>
        )}
      </View>

      {/* Category toggle */}
      <View style={styles.toggleGroup}>
        {hasCategory('interior') && (
          <Pressable
            onPress={() => switchMode('interior')}
            style={[styles.pill, viewMode === 'interior' && styles.pillActive]}
          >
            <Text style={[styles.pillText, viewMode === 'interior' && styles.pillTextActive]}>
              INTERIOR
            </Text>
          </Pressable>
        )}
        {hasCategory('exterior') && (
          <Pressable
            onPress={() => switchMode('exterior')}
            style={[styles.pill, viewMode === 'exterior' && styles.pillActive]}
          >
            <Text style={[styles.pillText, viewMode === 'exterior' && styles.pillTextActive]}>
              EXTERIOR
            </Text>
          </Pressable>
        )}
      </View>

      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050810',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050810',
  },
  loadingText: { color: 'white', fontSize: 16 },
  titleWrap: {
    position: 'absolute',
    top: '12%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
    paddingHorizontal: 24,
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  titleRule: {
    height: 2,
    width: 96,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 14,
  },
  carouselWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#000',
  },
  slideImage: { width: '100%', height: '100%' },
  slideFallback: { backgroundColor: '#111' },
  toggleGroup: {
    position: 'absolute',
    bottom: '8%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(113,155,197,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 999,
    zIndex: 50,
  },
  pill: {
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 999,
  },
  pillActive: {
    backgroundColor: '#3b79b6',
  },
  pillText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  pillTextActive: {
    color: '#ffffff',
  },
});
