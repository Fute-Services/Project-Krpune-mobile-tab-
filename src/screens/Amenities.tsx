import { View, StyleSheet, ImageBackground } from 'react-native';
import AmenitiesButtons from '../components/Amenities/AmenitiesButtons';
import { resolveAsset } from '../offline/resolveAsset';
import type { AssetSource } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';

const BG = 'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779279989/cam_4_2_igzh94.png';

export default function AmenitiesScreen() {
  const { isTablet } = useResponsive();
  const bg = resolveAsset(BG) as AssetSource;
  return (
    <ImageBackground source={bg} style={styles.root} resizeMode="cover">
      {/* Tablet: dock the level buttons on the RIGHT so they clear the left nav
          rail and sit cleanly against the edge. Phone keeps them on the left
          (bottom bar frees the left edge), nudged up so the last button clears
          the bottom nav bar. Vertically centred either way. */}
      <View
        style={[
          styles.buttons,
          isTablet
            ? { right: 48, transform: [{ translateY: -140 }] }
            : { left: 24, transform: [{ translateY: -104 }] },
        ]}
      >
        <AmenitiesButtons />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1020', justifyContent: 'center' },
  buttons: { position: 'absolute', top: '50%' },
});
