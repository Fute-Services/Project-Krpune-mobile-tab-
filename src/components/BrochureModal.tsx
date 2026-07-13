import { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Pdf from 'react-native-pdf';
import { Asset } from 'expo-asset';

// Bundled offline brochure. metro.config.js registers `pdf` as an asset ext,
// so require() returns a module id that expo-asset can resolve to a local file.
const BROCHURE = require('../assets/broucher/KRC.pdf');

/**
 * Full-screen in-app PDF viewer for the Corporate Profile brochure. Renders the
 * bundled KRC.pdf natively (react-native-pdf) so it opens offline and scrolls /
 * pinch-zooms fast — no network, no external PDF app.
 */
export default function BrochureModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [uri, setUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  // Resolve the bundled PDF to a local file:// uri the first time it's opened.
  useEffect(() => {
    if (!visible || uri) return;
    let cancelled = false;
    (async () => {
      try {
        const asset = Asset.fromModule(BROCHURE);
        if (!asset.localUri) await asset.downloadAsync();
        if (!cancelled) setUri(asset.localUri ?? asset.uri);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visible, uri]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Corporate Profile</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
            <Text style={styles.close}>×</Text>
          </Pressable>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {failed ? (
            <Text style={styles.note}>Unable to open the brochure.</Text>
          ) : uri ? (
            <Pdf
              source={{ uri, cache: true }}
              style={styles.pdf}
              trustAllCerts={false}
              onError={() => setFailed(true)}
              renderActivityIndicator={() => (
                <ActivityIndicator size="large" color="#76ACE2" />
              )}
            />
          ) : (
            <ActivityIndicator size="large" color="#76ACE2" />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b1020' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  title: { color: 'white', fontSize: 18, fontWeight: '700' },
  closeBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  close: { color: 'white', fontSize: 24, lineHeight: 26 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  pdf: { flex: 1, width: '100%', height: '100%', backgroundColor: '#0b1020' },
  note: { color: '#9aa4bf', fontSize: 14 },
});
