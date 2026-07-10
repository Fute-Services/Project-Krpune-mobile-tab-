import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { navigate } from '../../navigation/navigationRef';
import type { RootStackParamList } from '../../navigation/types';

type Plan = 'floor' | 'mobility' | 'vertical' | 'circulation';

const ITEMS: { key: Plan; label: string; route: keyof RootStackParamList }[] = [
  { key: 'floor', label: 'Floor Plan', route: 'ProjectDetails' },
  { key: 'mobility', label: 'Mobility', route: 'Mobility' },
  { key: 'vertical', label: 'Vertical Transport', route: 'VerticalTransport' },
  { key: 'circulation', label: 'Circulation', route: 'CirculationPlan' },
];

/** Vertical navigation panel shown on the Project Details flow.
 *  `compact` tightens the panel for the short phone-landscape layout. */
export default function ButtonDiv({
  active = 'floor',
  compact = false,
}: {
  active?: Plan;
  compact?: boolean;
}) {
  return (
    <View style={[styles.panel, compact && styles.panelCompact]}>
      {ITEMS.map((it) => {
        const isActive = it.key === active;
        return (
          <Pressable key={it.key} style={styles.btnWrap} onPress={() => navigate(it.route)}>
            <LinearGradient
              colors={isActive ? ['#105CA8', '#062442'] : ['rgba(58,124,165,0.4)', 'rgba(58,123,213,0.4)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.btn,
                compact && styles.btnCompact,
                { borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)' },
              ]}
            >
              <Text style={[styles.label, compact && styles.labelCompact]}>{it.label}</Text>
            </LinearGradient>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(9,75,137,0.89)',
    padding: 11,
    gap: 6,
    alignItems: 'center',
    width: 180,
  },
  panelCompact: { width: 150, padding: 7, gap: 5, borderRadius: 28 },
  btnWrap: { width: '90%' },
  btn: {
    height: 46,
    borderRadius: 14,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCompact: { height: 34, borderTopLeftRadius: 18, borderBottomRightRadius: 18 },
  label: { color: 'white', fontSize: 12, fontWeight: '600', letterSpacing: 0.5, textAlign: 'center' },
  labelCompact: { fontSize: 10, letterSpacing: 0.2 },
});
