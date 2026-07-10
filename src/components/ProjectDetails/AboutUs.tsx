import { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { navigate } from '../../navigation/navigationRef';
import { useResponsive } from '../../theme/responsive';
import GradientButton from '../GradientButton';
import backImg from '../../assets/back.png';
// Local brochure PDF — bundled but not yet wired to a viewer.
import brochurePdf from '../../assets/broucher/KRC.pdf';

interface AboutUsProps {
  handleClose?: () => void;
  handleOpen: () => void;
}

/**
 * Project overview card — converted from web ProjectDetails/AboutUs.
 * Modal-like glass card with expandable text + brochure / walkthrough / gallery
 * buttons.
 */
export default function AboutUs({ handleClose }: AboutUsProps) {
  const { isTablet } = useResponsive();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const openBrochure = () => {
    // PDF viewer not wired yet — keep a reference, no-op for now.
    console.log('Open brochure (no viewer yet):', brochurePdf);
  };

  return (
    <View style={styles.root}>
      {/* Card */}
      <View style={[styles.card, isTablet ? styles.cardTablet : styles.cardPhone]}>
        {/* Back button */}
        <Pressable style={styles.backBtn} onPress={handleClose}>
          <Image source={backImg} style={styles.backIcon} resizeMode="contain" />
        </Pressable>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Project overview</Text>
        </View>

        {/* Content */}
        <ScrollView
          style={isExpanded ? styles.contentExpanded : styles.contentPreview}
          scrollEnabled={isExpanded}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.paragraph}>
            Commerzone Baner shall be a premier Grade A commercial development
            strategically located in the thriving business hub of Baner,
            (West)Pune. Positioned across key commercial markets, it offers
            seamless connectivity and excellent access to major business
            districts, residential zones, and social infrastructure.
          </Text>
          <Text style={styles.paragraph}>
            Designed to cater to the needs of modern enterprises, the IT park
            fosters a vibrant, community-driven ecosystem that supports
            innovation, collaboration, and growth.
          </Text>
          <Text style={styles.paragraph}>
            Whether you're a multinational corporation or a dynamic homegrown
            enterprise, Commerzone Baner a future-ready workplace that aligns
            with the aspirations of "new age businesses" making it a preferred
            destination in Pune
          </Text>
        </ScrollView>

        {/* Toggle Button */}
        <Pressable style={styles.toggle} onPress={toggleExpanded}>
          <Text style={styles.toggleText}>
            {isExpanded ? 'See Less' : 'See More'}
          </Text>
        </Pressable>
      </View>

      {/* Bottom actions */}
      <View style={styles.actions}>
        <GradientButton onPress={openBrochure}>Corporate Profile</GradientButton>
        <GradientButton onPress={() => navigate('Walkthrough')}>
          Walkthrough
        </GradientButton>
        <GradientButton onPress={() => navigate('Gallery')}>Gallery</GradientButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  card: {
    padding: 32,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    maxHeight: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 60,
    elevation: 12,
  },
  cardPhone: { width: '80%' },
  cardTablet: { width: '55%', alignSelf: 'center' },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  backIcon: { width: 20, height: 20 },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.5,
  },
  contentPreview: { maxHeight: 128, marginBottom: 16 },
  contentExpanded: { marginBottom: 16 },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '300',
    marginBottom: 16,
  },
  toggle: {
    alignSelf: 'flex-start',
    height: 45,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(150,196,255,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    gap: 4,
  },
});
