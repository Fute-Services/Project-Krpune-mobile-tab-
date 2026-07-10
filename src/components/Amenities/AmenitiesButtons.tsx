import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navigate } from '../../navigation/navigationRef';
import type { RootStackParamList } from '../../navigation/types';

const ITEMS: { label: string; route: keyof RootStackParamList }[] = [
  { label: 'Terrace Level', route: 'TerraceLevel' },
  { label: 'Podium Level', route: 'PodiumLevel' },
  { label: 'Lobby Reception', route: 'LobbyReception' },
  { label: 'Ground Level', route: 'GroundLevel' },
];

export default function AmenitiesButtons() {
  return (
    <View style={styles.panel}>
      {ITEMS.map((it) => (
        <Pressable key={it.route} style={styles.btnWrap} onPress={() => navigate(it.route)}>
          <LinearGradient
            colors={['rgba(58,124,165,0.4)', 'rgba(58,123,213,0.4)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.label}>{it.label}</Text>
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
  label: { color: 'white', fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
});
