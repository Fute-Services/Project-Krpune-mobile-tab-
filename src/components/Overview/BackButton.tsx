import { Pressable, Image, StyleSheet } from 'react-native';
import { navigate, goBack } from '../../navigation/navigationRef';
import type { RootStackParamList } from '../../navigation/types';
import { useResponsive } from '../../theme/responsive';
import backImg from '../../assets/back.png';

/**
 * Overview-specific back button. Unlike the shared floating BackButton, this one
 * is NOT self-positioned — the parent screen wraps it in an absolutely-positioned
 * View (matching the web markup where the parent div sets top/left). If `to` is
 * given it navigates there, otherwise it goes back in the stack.
 */
export default function BackButton({ to }: { to?: keyof RootStackParamList }) {
  const { isTablet } = useResponsive();
  return (
    <Pressable
      onPress={() => (to ? navigate(to) : goBack())}
      style={({ pressed }) => [
        styles.btn,
        isTablet && styles.btnTablet,
        pressed && { transform: [{ scale: 0.95 }] },
      ]}
      hitSlop={10}
    >
      <Image
        source={backImg}
        style={isTablet ? styles.iconTablet : styles.icon}
        resizeMode="contain"
        tintColor="#ffffff"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Dark glass + white arrow + white ring — visible on light Overview skies too.
  btn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(15,23,42,0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnTablet: { width: 52, height: 52, borderRadius: 14 },
  icon: { width: 18, height: 18 },
  iconTablet: { width: 24, height: 24 },
});
