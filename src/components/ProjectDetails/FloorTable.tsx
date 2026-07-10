import { useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { navigate } from '../../navigation/navigationRef';

type Row = { name: string; t1: string; t2: string; id: number | null };

const DATA: Row[] = [
  { name: 'R-1st Floor', t1: '71,731', t2: '30,929', id: 1 },
  { name: '2nd Floor', t1: '79,343', t2: '34,624', id: 2 },
  { name: '3rd Floor', t1: '79,343', t2: '34,624', id: 3 },
  { name: '4th Floor', t1: '79,343', t2: '34,624', id: 4 },
  { name: 'R-5th Floor', t1: '71,731', t2: '30,929', id: 5 },
  { name: '6th Floor', t1: '79,343', t2: '34,624', id: 6 },
  { name: '7th Floor', t1: '79,343', t2: '34,624', id: 7 },
  { name: '8th Floor', t1: '79,343', t2: '34,624', id: 8 },
  { name: 'R-9th Floor', t1: '71,731', t2: '30,929', id: 9 },
  { name: '10th Floor', t1: '79,343', t2: '34,624', id: 10 },
  { name: '11th Floor', t1: '81,708', t2: '35,606', id: 11 },
  { name: '12th Floor', t1: '81,708', t2: '35,606', id: 12 },
  { name: 'R-13th Floor', t1: '74,031', t2: '31,858', id: 13 },
  { name: '14th Floor', t1: '81,708', t2: '35,606', id: 14 },
  { name: '15th Floor', t1: '81,708', t2: '35,606', id: 15 },
  { name: '16th Floor', t1: '81,708', t2: '35,606', id: 16 },
  { name: '17th Floor', t1: '81,708', t2: '35,606', id: 17 },
  { name: 'Lower Gr.Flr', t1: '34,947', t2: '-', id: 19 },
  { name: 'Upper Gr.Flr', t1: '1,048', t2: '15,175', id: 18 },
  { name: 'Podium 1', t1: '-', t2: '651', id: 20 },
  { name: 'Amenity', t1: '31,231', t2: '14,994', id: null },
  { name: 'Amenity', t1: '52,391', t2: '18,067', id: null },
];

const ROW_H = 38;

export default function FloorTable({
  hoveredFloor,
  setHoveredFloor,
}: {
  hoveredFloor: number | null;
  setHoveredFloor: (id: number | null) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll to the active floor (web offsetTop + scrollTo behaviour).
  useEffect(() => {
    if (hoveredFloor == null) return;
    const idx = DATA.findIndex((r) => r.id === hoveredFloor);
    if (idx >= 0) scrollRef.current?.scrollTo({ y: Math.max(0, idx * ROW_H - 40), animated: true });
  }, [hoveredFloor]);

  const openFloor = (id: number | null) => {
    if (id != null && id >= 1 && id <= 26 && id !== 19) navigate('UnitPlan', { id: String(id) });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.hCell, { flex: 1 }]}>Floor</Text>
        <Text style={[styles.hCell, { flex: 1.5 }]}>Tower 1 sqft</Text>
        <Text style={[styles.hCell, { flex: 1.5 }]}>Tower 2 sqft</Text>
      </View>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {DATA.map((row, i) => {
          const active = row.id !== null && hoveredFloor === row.id;
          return (
            <Pressable
              key={i}
              onPressIn={() => row.id !== null && setHoveredFloor(row.id)}
              onPress={() => openFloor(row.id)}
              style={[styles.row, active && styles.rowActive]}
            >
              <Text style={[styles.cell, { flex: 1 }, active && styles.cellActive]}>{row.name}</Text>
              <Text style={[styles.cell, { flex: 1.5, textAlign: 'center' }, active && styles.cellActive]}>
                {row.t1}
              </Text>
              <Text style={[styles.cell, { flex: 1.5, textAlign: 'center' }, active && styles.cellActive]}>
                {row.t2}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(43,58,74,0.75)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#1e2a38',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  hCell: { color: 'white', fontWeight: '600', fontSize: 11, textAlign: 'center', paddingVertical: 10 },
  row: {
    flexDirection: 'row',
    height: ROW_H,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  rowActive: { backgroundColor: '#003264' },
  cell: { color: 'rgba(255,255,255,0.9)', fontSize: 11, paddingHorizontal: 8 },
  cellActive: { color: 'white', fontWeight: '700' },
});
