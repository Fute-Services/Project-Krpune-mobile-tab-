import { create } from 'zustand';
import { floorData } from '../data/FloorData';
import type { Floor, FloorStore } from '../types/uniTypes';

export const useFloorStore = create<FloorStore>((set, get) => ({
  floors: floorData as unknown as Floor[],
  selectedUnitId: null,
  hoveredUnitId: null,

  setSelectedUnit: (id) => set({ selectedUnitId: id }),
  setHoveredUnit: (id) => set({ hoveredUnitId: id }),
  getFloorById: (id) => get().floors.find((f) => f.id === Number(id)),

  getUnitById: (combinedId: any) => {
    // combinedId is "1-1" (FloorID-UnitID)
    const [fId, uId] = String(combinedId).split('-');
    const floor = get().floors.find((f) => String(f.id) === fId);
    if (!floor) return undefined;
    return floor.units.find((u) => String(u.id) === uId);
  },
}));
