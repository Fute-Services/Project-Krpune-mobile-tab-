import { Pressable, Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { goBack, navigate } from '../navigation/navigationRef';
import type { RootStackParamList } from '../navigation/types';
import backImg from '../assets/back.png';

/**
 * Floating back button — mirrors the white rounded back button used across the
 * web app's video/detail screens. If `to` is given it navigates there, else goes
 * back in the stack (web `navigate(-1)`).
 */
export default function BackButton({ to }: { to?: keyof RootStackParamList }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { top: insets.top + 8 }]} pointerEvents="box-none">
      <Pressable
        onPress={() => (to ? navigate(to) : goBack())}
        style={({ pressed }) => [styles.btn, pressed && { transform: [{ scale: 0.92 }] }]}
        hitSlop={10}
      >
        <Image source={backImg} style={styles.icon} resizeMode="contain" tintColor="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, zIndex: 1500 },
  // Dark glass + white arrow + white ring so it stays clearly visible on any
  // background (light skies, white plans, dark panoramas alike).
  btn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  icon: { width: 20, height: 20 },
});
