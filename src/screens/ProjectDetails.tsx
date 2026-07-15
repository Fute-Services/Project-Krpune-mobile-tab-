import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BuildingImage from '../components/ProjectDetails/BuildingImage';
import ButtonDiv from '../components/ProjectDetails/ButtonDiv';
import FloorTable from '../components/ProjectDetails/FloorTable';
import { navigate } from '../navigation/navigationRef';
import { useResponsive } from '../theme/responsive';

export default function ProjectDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

  return (
    <View style={styles.root}>
      {/* Building image centered */}
      <View style={styles.buildingWrap} pointerEvents="box-none">
        <BuildingImage hoveredFloor={hoveredFloor} setHoveredFloor={setHoveredFloor} />
      </View>

      {/* Floor table — right panel. On phone (short landscape height) the table and
          the nav panel share the right column, so the table is kept short and the
          panel is dropped to the bottom-right to guarantee they never overlap.
          On tablet the table is nudged down a little from the very top so it does
          not crowd the top-right corner. */}
      <View
        style={[
          styles.tableWrap,
          {
            top: isTablet ? insets.top + 100 : insets.top + 12,
            width: isTablet ? 310 : 190,
            height: isTablet ? '45%' : '36%',
          },
        ]}
      >
        <FloorTable hoveredFloor={hoveredFloor} setHoveredFloor={setHoveredFloor} />
      </View>

      {/* Nav panel — bottom right */}
      <View style={[styles.buttonsWrap, { bottom: insets.bottom + (isTablet ? 96 : 12) }]}>
        <ButtonDiv active="floor" compact={!isTablet} />
      </View>

      {/* Overview button — bottom left */}
      <Pressable
        style={[styles.overviewBtn, { bottom: insets.bottom + 100 }]}
        onPress={() => navigate('Overview')}
      >
        <LinearGradient
          colors={['rgba(200,243,255,0.54)', 'rgba(128,149,255,0.54)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.overviewInner}
        >
          <Text style={styles.overviewText}>Overview</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1020' },
  buildingWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableWrap: { position: 'absolute', right: 12, zIndex: 100 },
  buttonsWrap: { position: 'absolute', right: 16, zIndex: 1200 },
  overviewBtn: { position: 'absolute', left: 16, zIndex: 50, width: 160, height: 46 },
  overviewInner: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewText: { color: 'white', fontSize: 13, fontWeight: '500' },
});
