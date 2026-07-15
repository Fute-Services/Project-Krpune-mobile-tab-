import { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import Svg, { Image as SvgImage, Polygon } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getFloors } from '../services/floorServices';
import { resolveAsset } from '../offline/resolveAsset';
import { navigate, goBack } from '../navigation/navigationRef';
import { useResponsive } from '../theme/responsive';

import bgUnit from '../assets/unit/bgUnit.jpg';
import backImg from '../assets/back.png';
import compass from '../assets/unit/compass.png';
import resetIcon from '../assets/unit/reset.png';
import zoomInIcon from '../assets/unit/zoomin-icon.png';
import zoomOutIcon from '../assets/unit/Zoomout-icon.jpg';
import unitLogo from '../assets/unit/Unit_Logo.png';

export default function UnitPlanScreen({ route }: any) {
  const id: string = String(route?.params?.id ?? '');
  const insets = useSafeAreaInsets();
  const { isTablet } = useResponsive();

  const [floors, setFloors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0); // 0 = 3D, 1 = 2D
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Pinch + pan shared values
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const savedTx = useSharedValue(0);
  const savedTy = useSharedValue(0);

  useEffect(() => {
    getFloors()
      .then((res) => setFloors(res.data?.data || []))
      .catch((e) => console.log('unitplan floors error', e))
      .finally(() => setLoading(false));
  }, []);

  const unitData = useMemo(() => floors.find((f) => String(f.id) === id), [floors, id]);
  const currentUnit = unitData?.units?.[0] ?? null;

  useEffect(() => {
    if (currentUnit?.sideContent?.length) setActiveRoom(currentUnit.sideContent[0].name);
  }, [currentUnit]);

  const applyScale = (next: number) => {
    scale.value = withTiming(next);
    savedScale.value = next;
    if (next <= 1) {
      tx.value = withTiming(0);
      ty.value = withTiming(0);
      savedTx.value = 0;
      savedTy.value = 0;
      setShowOverlay(true);
    }
  };
  const zoomIn = () => applyScale(Math.min(savedScale.value + 0.3, 3));
  const zoomOut = () => applyScale(Math.max(savedScale.value - 0.3, 1));
  const resetView = () => applyScale(1);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(1, Math.min(savedScale.value * e.scale, 3));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= 1) runOnJS(setShowOverlay)(true);
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (savedScale.value > 1) {
        tx.value = savedTx.value + e.translationX;
        ty.value = savedTy.value + e.translationY;
      }
    })
    .onEnd(() => {
      savedTx.value = tx.value;
      savedTy.value = ty.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const imgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#fff" />
        <Text style={styles.dim}>Loading Unit Details...</Text>
      </View>
    );
  }
  if (!unitData || !currentUnit) {
    return (
      <View style={styles.center}>
        <Text style={styles.white}>Floor data not found for ID: {id}</Text>
        <Pressable onPress={() => goBack()} style={styles.goBack}>
          <Text style={styles.white}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const planImages = [currentUnit.image3D, currentUnit.image2D];
  const planSrc = resolveAsset(planImages[imageIndex]);
  const nextSrc = resolveAsset(planImages[(imageIndex + 1) % planImages.length]);
  const overlaySrc = currentUnit.overlayImage ? resolveAsset(currentUnit.overlayImage) : undefined;
  const info = currentUnit.unitInformation;
  const rooms: any[] = currentUnit.sideContent || [];

  // Room "marking": each room carries polygons digitised in the overlay
  // (building-render) image's native pixel space. We draw them in an SVG whose
  // viewBox equals that image's natural size, so the highlight lands exactly on
  // the room regardless of how the image is fitted/scaled on screen.
  const overlayMeta = overlaySrc ? Image.resolveAssetSource(overlaySrc as any) : null;
  const vbW = overlayMeta?.width || 2000;
  const vbH = overlayMeta?.height || 1125;
  const activeRoomData = rooms.find((r) => r.name === activeRoom);
  const activePolys: any[] = (activeRoomData?.polygons || []).filter((p: any) => p?.points);

  const toggleImage = () => {
    setImageIndex((i) => (i + 1) % 2);
    resetView();
  };

  // The sinking building overlay belongs to the 3D view only. On tablet we show
  // it just in 3D (imageIndex 0) and hide the base plate underneath it so the two
  // don't overlap; the 2D view then shows its own plan directly (no overlay, no
  // overlap). Phone keeps the original behaviour.
  const is3D = imageIndex === 0;
  const overlayVisible = !!overlaySrc && showOverlay && (!isTablet || is3D);
  const hideBase = isTablet && is3D && showOverlay && !!overlaySrc;

  return (
    <ImageBackground source={bgUnit} style={styles.root} resizeMode="cover">
      {/* Floor name watermark */}
      <Text style={[styles.watermark, !isTablet && styles.watermarkPhone]} numberOfLines={1}>
        {unitData.name}
      </Text>

      {/* Zoomable plan */}
      <GestureDetector gesture={composed}>
        <Animated.View style={[styles.stage, isTablet && styles.stageTablet]}>
          <Animated.View style={[styles.planWrap, imgStyle]}>
            {/* Base plan (3D floor plate / 2D plan). While the sinking overlay
                (the building render, which has a transparent background) is on
                top, hide the base so the two don't show through each other and
                look like two overlapping images — matches the web (base opacity
                0 while the overlay is up). It reveals when the overlay is tapped. */}
            {planSrc && (
              <Image
                source={planSrc}
                style={[styles.plan, hideBase ? styles.hidden : null]}
                resizeMode="contain"
              />
            )}
            {/* Sinking overlay image — tap to dive in (3D view only on tablet).
                On tablet the image is drawn inside an SVG so the selected room's
                marking polygons can be overlaid in the image's own coordinate
                space (perfectly aligned). Phone keeps the plain image. */}
            {overlayVisible && (
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => {
                  setShowOverlay(false);
                  applyScale(1.3);
                }}
              >
                {isTablet ? (
                  <Svg
                    width="100%"
                    height="100%"
                    viewBox={`0 0 ${vbW} ${vbH}`}
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <SvgImage
                      href={overlaySrc as any}
                      x={0}
                      y={0}
                      width={vbW}
                      height={vbH}
                      preserveAspectRatio="xMidYMid meet"
                    />
                    {activePolys.map((p, i) => (
                      <Polygon
                        key={i}
                        points={p.points}
                        fill="rgba(144,199,255,0.5)"
                        stroke="#ffffff"
                        strokeWidth={4}
                      />
                    ))}
                  </Svg>
                ) : (
                  <Image source={overlaySrc} style={styles.plan} resizeMode="contain" />
                )}
              </Pressable>
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>

      {/* Unit logo top-right */}
      <Image
        source={unitLogo}
        style={[styles.unitLogo, !isTablet && styles.unitLogoPhone, { top: insets.top + 8 }]}
        resizeMode="contain"
      />

      {/* Back */}
      <Pressable style={[styles.iconBtn, { top: insets.top + 8, left: 14 }]} onPress={() => goBack()}>
        <Image source={backImg} style={styles.iconImg} resizeMode="contain" />
      </Pressable>

      {/* Side panel: unit info + rooms.
          In 2D view the plan image already carries its OWN baked-in legend at the
          top-left (Services lift lobby / AHU room / …), which collided with this
          panel. On tablet we hide the panel while the 2D plan is showing so the
          two never overlap; it returns when you switch back to 3D. */}
      {panelOpen && !(isTablet && imageIndex === 1) && (
        <View style={[styles.panel, { top: insets.top + 64, width: isTablet ? 260 : 190 }]}>
          {info?.title && (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{info.title}</Text>
              <View style={styles.infoRow}>
                {!!info.T1 && (
                  <Text style={styles.infoT}>
                    T1: <Text style={styles.infoBold}>{info.T1}</Text>
                  </Text>
                )}
                {!!info.T2 && (
                  <Text style={styles.infoT}>
                    T2: <Text style={styles.infoBold}>{info.T2}</Text>
                  </Text>
                )}
              </View>
            </View>
          )}
          <ScrollView style={{ maxHeight: isTablet ? 260 : 150 }} showsVerticalScrollIndicator={false}>
            {rooms.map((r) => {
              const active = activeRoom === r.name;
              return (
                <Pressable key={r._id || r.id} onPress={() => setActiveRoom(r.name)} style={styles.roomRow}>
                  <View style={[styles.dot, active && styles.dotActive]} />
                  <Text style={[styles.roomText, active && styles.roomTextActive]}>{r.name}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Panel toggle (phone) — sits in the top bar beside Back so it never covers
          the info panel below. */}
      {!isTablet && (
        <Pressable style={[styles.iconBtn, { top: insets.top + 8, left: 64 }]} onPress={() => setPanelOpen((v) => !v)}>
          <Text style={styles.toggleTxt}>{panelOpen ? '▲' : '▼'}</Text>
        </Pressable>
      )}

      {/* Minimap: toggle 2D/3D — dropped to the bottom-left corner on phone so it
          clears the (shortened) room list above it. */}
      <Pressable
        style={[styles.minimap, { bottom: insets.bottom + (isTablet ? 84 : 18) }]}
        onPress={toggleImage}
      >
        {nextSrc && <Image source={nextSrc} style={styles.minimapImg} resizeMode="cover" />}
        <View style={styles.minimapLabel}>
          <Text style={styles.minimapText}>{imageIndex === 0 ? '2D' : '3D'}</Text>
        </View>
      </Pressable>

      {/* Zoom controls + compass */}
      <View style={[styles.controls, { bottom: insets.bottom + 84 }]}>
        <Pressable style={styles.ctrlBtn} onPress={zoomIn}>
          <Image source={zoomInIcon} style={styles.ctrlImg} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.ctrlBtn} onPress={zoomOut}>
          <Image source={zoomOutIcon} style={styles.ctrlImg} resizeMode="contain" />
        </Pressable>
        <Pressable style={styles.ctrlBtn} onPress={resetView}>
          <Image source={resetIcon} style={styles.ctrlImg} resizeMode="contain" />
        </Pressable>
        <Image source={compass} style={[styles.compass, !isTablet && styles.compassPhone]} resizeMode="contain" />
      </View>

      {/* Fit out plan */}
      <Pressable style={[styles.fitout, { bottom: insets.bottom + 18 }]} onPress={() => navigate('Fitout')}>
        <Text style={styles.fitoutText}>Fit out plan</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#101010' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#101010', gap: 12 },
  white: { color: 'white' },
  dim: { color: 'rgba(255,255,255,0.6)', marginTop: 8 },
  goBack: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 },
  watermark: {
    position: 'absolute',
    bottom: '5%',
    left: 16,
    color: 'rgba(255,255,255,0.28)',
    fontSize: 44,
    fontWeight: '400',
  },
  watermarkPhone: { fontSize: 34, bottom: '3%' },
  stage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  // On tablet, inset the plan so the building render sits a touch smaller and
  // clears the left room panel and the bottom controls instead of filling edge
  // to edge.
  stageTablet: { paddingTop: 48, paddingBottom: 104, paddingLeft: 190, paddingRight: 84 },
  planWrap: { width: '100%', height: '100%' },
  plan: { width: '100%', height: '100%' },
  hidden: { opacity: 0 },
  unitLogo: { position: 'absolute', right: 20, width: 80, height: 80, zIndex: 50 },
  unitLogoPhone: { width: 52, height: 52, right: 12 },
  iconBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 110,
  },
  iconImg: { width: 20, height: 20 },
  toggleTxt: { color: '#0f2e50', fontSize: 14, fontWeight: '700' },
  panel: { position: 'absolute', left: 14, zIndex: 100 },
  infoBox: { marginBottom: 16, paddingHorizontal: 4 },
  infoTitle: { color: 'white', fontSize: 15, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', gap: 16, marginTop: 4 },
  infoT: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  infoBold: { fontWeight: '800' },
  roomRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { backgroundColor: '#90C7FF' },
  roomText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  roomTextActive: { color: 'white', fontWeight: '700' },
  minimap: {
    position: 'absolute',
    left: 16,
    width: 96,
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    zIndex: 90,
  },
  minimapImg: { width: '100%', height: '100%' },
  minimapLabel: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  minimapText: { color: 'white', fontSize: 11, fontWeight: '700' },
  controls: { position: 'absolute', right: 16, gap: 10, alignItems: 'center', zIndex: 90 },
  ctrlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlImg: { width: 22, height: 22 },
  compass: { width: 46, height: 46, marginTop: 4 },
  compassPhone: { width: 34, height: 34 },
  fitout: {
    position: 'absolute',
    right: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#90C7FF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    zIndex: 100,
  },
  fitoutText: { color: '#0f2e50', fontSize: 15, fontWeight: '600' },
});
