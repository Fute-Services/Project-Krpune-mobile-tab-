import { View, Image, StyleSheet } from 'react-native';
import { useResponsive } from '../../theme/responsive';
import logo from '../../assets/logo.png';

/**
 * White rounded logo badge anchored to the top-right of the Overview screens.
 * Mirrors the web `Logo` (white box with rounded bottom corners, offset from
 * the right edge).
 */
export default function Logo() {
  const { isTablet } = useResponsive();
  return (
    <View style={[styles.wrap, isTablet ? styles.wrapTablet : styles.wrapPhone]}>
      <Image
        source={logo}
        style={isTablet ? styles.logoTablet : styles.logoPhone}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    right: 80,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 40,
  },
  wrapPhone: { paddingHorizontal: 12, paddingVertical: 8 },
  wrapTablet: { paddingHorizontal: 28, paddingVertical: 18 },
  logoPhone: { height: 40, width: 96 },
  logoTablet: { height: 80, width: 190 },
});
