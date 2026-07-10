import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { navigate } from '../../navigation/navigationRef';
import type { RootStackParamList } from '../../navigation/types';

/**
 * Glass pill navbar with the Sustainability / Concept Summary tabs. The active
 * tab uses the solid dark blue fill; inactive tabs use the blue gradient.
 * Mirrors the web BottomNavbar (which highlighted the active route).
 */
export default function BottomNavbar() {
  const route = useRoute();
  const active = route.name as keyof RootStackParamList;

  return (
    <View style={styles.container}>
      <NavButton
        label="Sustainability"
        active={active === 'Sustainability'}
        onPress={() => navigate('Sustainability')}
      />
      <NavButton
        label="Concept Summary"
        active={active === 'ConceptSummary'}
        onPress={() => navigate('ConceptSummary')}
      />
    </View>
  );
}

function NavButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { transform: [{ scale: 0.96 }] }]}
    >
      {active ? (
        <View style={[styles.btn, styles.btnActive]}>
          <Text style={styles.btnText}>{label}</Text>
        </View>
      ) : (
        <LinearGradient
          colors={['#407BB6', '#76ACE2'] as const}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.btn}
        >
          <Text style={styles.btnText}>{label}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(29,78,216,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  btn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    backgroundColor: '#0a2647',
  },
  btnText: {
    color: '#fff',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
