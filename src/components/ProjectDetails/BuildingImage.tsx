import { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Image as SvgImage, Polygon } from 'react-native-svg';
import { getFloors } from '../../services/floorServices';
import { navigate } from '../../navigation/navigationRef';
import building from '../../assets/project_details/TowerImage5.jpg';

type FloorPoly = {
  id: number | string;
  id1?: string;
  polygon: string;
  hoverColor?: string;
};

const VB_W = 3877;
const VB_H = 1899;

export default function BuildingImage({
  hoveredFloor,
  setHoveredFloor,
}: {
  hoveredFloor: number | null;
  setHoveredFloor: (id: number | null) => void;
}) {
  const { width, height } = useWindowDimensions();
  const [floors, setFloors] = useState<FloorPoly[]>([]);

  useEffect(() => {
    getFloors()
      .then((res) => setFloors(res.data?.data || []))
      .catch((e) => console.log('floors error', e));
  }, []);

  // Fit the building's aspect ratio into the screen.
  const ar = VB_W / VB_H;
  const w = Math.min(width, height * ar);
  const h = w / ar;

  const openFloor = (id: number | string) => {
    const n = Number(id);
    if (!Number.isNaN(n)) navigate('UnitPlan', { id: String(n) });
  };

  return (
    <View style={[styles.wrap, { width: w, height: h }]}>
      <Svg width={w} height={h} viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none">
        <SvgImage href={building} width={VB_W} height={VB_H} preserveAspectRatio="none" />
        {floors.map((f, i) => {
          const active = hoveredFloor === Number(f.id);
          return (
            <Polygon
              key={i}
              points={f.polygon}
              transform="translate(0, 5)"
              fill={active ? f.hoverColor || 'rgba(16,92,168,0.45)' : 'transparent'}
              stroke={active ? 'white' : 'transparent'}
              strokeWidth={2}
              onPressIn={() => setHoveredFloor(Number(f.id))}
              onPress={() => openFloor(f.id)}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
});
