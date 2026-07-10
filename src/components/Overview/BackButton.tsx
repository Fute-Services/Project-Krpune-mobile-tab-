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
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnTablet: { width: 52, height: 52, borderRadius: 14 },
  icon: { width: 18, height: 18 },
  iconTablet: { width: 24, height: 24 },
});
