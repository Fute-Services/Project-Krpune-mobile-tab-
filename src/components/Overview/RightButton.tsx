import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navigate } from '../../navigation/navigationRef';
import { useResponsive } from '../../theme/responsive';

/**
 * Floating "Walkthrough / Gallery" quick-nav pair. In the web app this was the
 * active (un-commented) RightButton export — two blue gradient pills.
 * Web spec: px-5 md:px-8 py-2 md:py-3 text-[11px] md:text-sm, gap-3, rounded-3xl.
 */
export default function RightButton() {
  const { select } = useResponsive();

  // Web breakpoints: phone (<md), tablet/desktop (>=md).
  const padX = select({ phone: 20, tablet: 30, large: 34 });
  const padXWide = select({ phone: 26, tablet: 44, large: 50 });
  const padY = select({ phone: 8, tablet: 11, large: 12 });
  const fontSize = select({ phone: 11, tablet: 13, large: 14 });
  const gap = select({ phone: 10, tablet: 12, large: 12 });

  return (
    <View style={[styles.container, { gap }]}>
      <Pressable
        onPress={() => navigate('Walkthrough')}
        style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <LinearGradient
          colors={['#407BB6', '#76ACE2'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, { paddingHorizontal: padX, paddingVertical: padY }]}
        >
          <Text style={[styles.btnText, { fontSize }]}>Walkthrough</Text>
        </LinearGradient>
      </Pressable>

      <Pressable
        onPress={() => navigate('Gallery')}
        style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}
      >
        <LinearGradient
          colors={['#407BB6', '#76ACE2'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.btn, { paddingHorizontal: padXWide, paddingVertical: padY }]}
        >
          <Text style={[styles.btnText, { fontSize }]}>Gallery</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnText: {
    color: '#fff',
    letterSpacing: 0.5,
  },
});
