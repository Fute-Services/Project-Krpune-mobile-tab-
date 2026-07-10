import { useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigate } from '../navigation/navigationRef';
import { resolveAsset } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';
import DayNightToggle, { FloatingButton } from '../components/DayNightToggle';
import RightButton from '../components/Overview/RightButton';

import logo from '../assets/logo.png';
import metricsIcon from '../assets/blueprint.png';
import broucherIcon from '../assets/broucher.png';
import constructionIcon from '../assets/construction.png';

const NIGHT_BG =
  'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779280128/C02_2.jpg_vcclaz.jpg';
const DAY_BG =
  'https://res.cloudinary.com/db0f2ofgf/image/upload/v1779280182/day_x1f_cwkyrz.png';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { select, isPhone } = useResponsive();
  const [isNight, setIsNight] = useState(true);
  const [showPdf, setShowPdf] = useState(false);

  const bg = resolveAsset(isNight ? NIGHT_BG : DAY_BG);

  // Responsive sizes — mirror web breakpoints (phone <=430, tablet <=768, desktop base).
  // Phone-landscape is short, so keep the right control stack compact enough that the
  // logo badge + pill + day/night toggle all fit without clipping.
  const btnSize = select({ phone: 40, tablet: 54, large: 60 }); // .floating-btn
  const pillGap = select({ phone: 10, tablet: 16, large: 18 }); // right-controls inner gap
  const rightOffset = select({ phone: 12, tablet: 20, large: 24 }); // .right-controls right
  const stackGap = select({ phone: 12, tablet: 14, large: 16 }); // pill -> toggle gap

  // Left wordmark logo (.header-logo1 — contain, height 80/70/55 on web).
  const logoH = select({ phone: 34, tablet: 48, large: 60 });

  // White rounded-bottom logo card (.white-header1).
  const cardW = select({ phone: 62, tablet: 90, large: 112 });
  const cardH = select({ phone: 70, tablet: 104, large: 126 });
  const cardRadius = select({ phone: 20, tablet: 30, large: 40 });

  const labelSize = select({ phone: 9, tablet: 10, large: 11 });

  return (
    <ImageBackground source={bg} style={styles.root} resizeMode="cover">
      {/* Top-left wordmark logo (.header-content > .header-logo1) */}
      <View style={[styles.headerLeft, { top: insets.top + 10 }]} pointerEvents="none">
        <Image
          source={logo}
          style={{ height: logoH, width: logoH * 3.1 }}
          resizeMode="contain"
        />
      </View>

      {/* Top-right white logo badge (.white-header1) */}
      <View
        style={[
          styles.whiteCard,
          {
            top: 0,
            right: rightOffset + 8,
            width: cardW,
            height: cardH,
            borderBottomLeftRadius: cardRadius,
            borderBottomRightRadius: cardRadius,
          },
        ]}
        pointerEvents="none"
      >
        <Image
          source={logo}
          style={{ width: cardW * 0.78, height: cardH * 0.5 }}
          resizeMode="contain"
        />
      </View>

      {/* Right vertical control stack (.right-controls — fixed, vertically centered).
          On phone-landscape the height is short, so anchor the stack just below the
          top-right logo badge instead of centring it (which would overlap the badge). */}
      <View
        style={[
          styles.rightControls,
          { right: rightOffset },
          isPhone && { justifyContent: 'flex-start', paddingTop: cardH + 6 },
        ]}
      >
        <LinearGradient
          colors={['rgba(16,60,120,0.28)', 'rgba(6,36,66,0.4)']}
          style={[styles.pill, { gap: pillGap }]}
        >
          <Control
            icon={metricsIcon}
            label="Project Info"
            size={btnSize}
            labelSize={labelSize}
            tint
            onPress={() => navigate('ProjectInfo')}
          />
          <Control
            icon={broucherIcon}
            label={'Corporate\nProfile'}
            size={btnSize}
            labelSize={labelSize}
            onPress={() => setShowPdf(true)}
          />
          <Control
            icon={constructionIcon}
            label={'Construction\nProgress'}
            size={btnSize}
            labelSize={labelSize}
            tint
            onPress={() => navigate('Construction')}
          />
        </LinearGradient>

        <View style={{ marginTop: stackGap }}>
          <DayNightToggle isNight={isNight} onToggle={() => setIsNight((v) => !v)} size={btnSize} />
        </View>
      </View>

      {/* Bottom-left Walkthrough / Gallery buttons (.ho) */}
      <View
        style={[
          styles.bottomLeft,
          {
            left: select({ phone: 20, tablet: 72, large: 56 }),
            bottom: select<number>({ phone: insets.bottom + 80, tablet: 90, large: 70 }),
          },
        ]}
      >
        <RightButton />
      </View>

      {/* Corporate Profile (brochure) modal — offline PDF viewer is a follow-up */}
      <Modal visible={showPdf} transparent animationType="fade" onRequestClose={() => setShowPdf(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPdf(false)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation?.()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Corporate Profile</Text>
              <Pressable onPress={() => setShowPdf(false)} hitSlop={10}>
                <Text style={styles.modalClose}>×</Text>
              </Pressable>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalNote}>
                Brochure (KRC.pdf) is bundled offline. An in-app PDF viewer will be wired up next.
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ImageBackground>
  );
}

function Control({
  icon,
  label,
  onPress,
  size,
  labelSize,
  tint,
}: {
  icon: number;
  label: string;
  onPress: () => void;
  size: number;
  labelSize: number;
  tint?: boolean;
}) {
  const iconSize = Math.round(size * 0.42);
  return (
    <View style={styles.control}>
      <FloatingButton onPress={onPress} size={size}>
        <Image
          source={icon}
          style={{ width: iconSize, height: iconSize, tintColor: tint ? '#ffffff' : undefined }}
          resizeMode="contain"
        />
      </FloatingButton>
      <Text style={[styles.controlLabel, { fontSize: labelSize, lineHeight: labelSize + 2 }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1020' },
  headerLeft: { position: 'absolute', left: 20, zIndex: 10 },
  whiteCard: {
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  // Vertically centered on the right edge (web: position:fixed; top:50%; translateY(-50%)).
  rightControls: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  pill: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  control: { alignItems: 'center', gap: 4 },
  controlLabel: {
    color: 'white',
    textAlign: 'center',
  },
  bottomLeft: { position: 'absolute', zIndex: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#0e1730',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  modalClose: { color: 'white', fontSize: 26, lineHeight: 26 },
  modalBody: { padding: 22 },
  modalNote: { color: '#9aa4bf', fontSize: 14, lineHeight: 20 },
});
