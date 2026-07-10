import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navigate } from '../../navigation/navigationRef';
import { useResponsive } from '../../theme/responsive';
import type { RootStackParamList } from '../../navigation/types';

const ITEMS: { label: string; route: keyof RootStackParamList }[] = [
  { label: 'Terrace Level', route: 'TerraceLevel' },
  { label: 'Podium Level', route: 'PodiumLevel' },
  { label: 'Lobby Reception', route: 'LobbyReception' },
  { label: 'Ground Level', route: 'GroundLevel' },
];

export default function AmenitiesButtons() {
  const { isPhone } = useResponsive();
  return (
    <View style={[styles.panel, isPhone && styles.panelPhone]}>
      {ITEMS.map((it) => (
        <Pressable key={it.route} style={styles.btnWrap} onPress={() => navigate(it.route)}>
          <LinearGradient
            colors={['rgba(58,124,165,0.4)', 'rgba(58,123,213,0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.btn, isPhone && styles.btnPhone]}
          >
            <Text style={[styles.label, isPhone && styles.labelPhone]}>{it.label}</Text>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    padding: 10,
    gap: 10,
    width: 200,
    alignItems: 'center',
  },
  panelPhone: { width: 152, padding: 7, gap: 7, borderRadius: 16 },
  btnWrap: { width: '90%' },
  btn: {
    height: 56,
    borderRadius: 12,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPhone: { height: 38, borderTopLeftRadius: 18, borderBottomRightRadius: 18 },
  label: { color: 'white', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
  labelPhone: { fontSize: 11, letterSpacing: 0.2 },
});
