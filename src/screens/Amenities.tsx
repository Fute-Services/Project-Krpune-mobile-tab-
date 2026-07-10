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
      {/* Clear the left rail (left:40 + width:80 ≈ 120) on tablet; phone uses a
          bottom bar so the left edge is free. Vertically centred like the rail —
          nudged up on phone so the last button clears the bottom nav bar. */}
      <View
        style={[
          styles.buttons,
          { left: isTablet ? 150 : 24, transform: [{ translateY: isTablet ? -140 : -164 }] },
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
