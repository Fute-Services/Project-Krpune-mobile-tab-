import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { resolveAsset } from '../offline/resolveAsset';
import { useResponsive } from '../theme/responsive';

import pannellumJs from '../../assets/pano/pannellum.js.txt';
import pannellumCss from '../../assets/pano/pannellum.css.txt';

/**
 * Offline 360° equirectangular panorama viewer — native parity for the web app's
 * Pannellum/Three.js viewers. Renders Pannellum inside a WebView with the library
 * inlined (bundled offline) and the panorama image loaded from the bundled asset's
 * local file:// URI. Full drag-to-look, pinch-zoom and inertia come from Pannellum.
 */
async function assetText(mod: number): Promise<string> {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  return FileSystem.readAsStringAsync(asset.localUri || asset.uri);
}

function mimeOf(name: string): string {
  const n = name.toLowerCase();
  if (n.endsWith('.png')) return 'image/png';
  if (n.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Copy a bundled panorama into the app cache dir and return just its FILENAME
 * (a sibling of the generated viewer HTML). Because the WebView is loaded from a
 * file:// URL in the same dir, it can read this by relative path with
 * allowFileAccessFromFileURLs — without inflating the ~3-5 MB image into a giant
 * base64 data: string (the old approach, which was slow and janked on every
 * scene switch). Returns a base64 data: URI as a fallback if the copy fails.
 */
async function panoRefInCache(mod: number): Promise<string> {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  try {
    const ext = (asset.type || uri.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '');
    const name = `pano_${asset.hash || asset.name}.${ext}`;
    const dest = `${FileSystem.cacheDirectory}${name}`;
    const info = await FileSystem.getInfoAsync(dest);
    if (!info.exists) await FileSystem.copyAsync({ from: uri, to: dest });
    return name; // relative filename
  } catch {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' as any });
    return `data:${mimeOf(uri)};base64,${base64}`;
  }
}

export default function PanoramaViewer({
  imageUrl,
  style,
  autoRotate = true,
}: {
  imageUrl: string;
  style?: ViewStyle | ViewStyle[];
  autoRotate?: boolean;
}) {
  const [htmlUri, setHtmlUri] = useState<string | null>(null);
  const { isTablet } = useResponsive();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [js, css] = await Promise.all([assetText(pannellumJs), assetText(pannellumCss)]);

        // Resolve the panorama to a cache-relative filename (offline) or a URL.
        const resolved = resolveAsset(imageUrl);
        let panoRef = imageUrl;
        let key = 'net';
        if (typeof resolved === 'number') {
          panoRef = await panoRefInCache(resolved);
          key = panoRef.replace(/[^a-z0-9]/gi, '');
        } else if (resolved && 'uri' in resolved) {
          panoRef = resolved.uri;
        }

        const doc = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>${css}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}
#panorama{width:100vw;height:100vh;}
/* On tablet, move Pannellum's +/- zoom control to the top-right so it no longer
   collides with (and hides) the app's back button in the top-left corner. */
${isTablet ? '.pnlm-controls-container{top:64px !important;left:auto !important;right:12px !important;}' : ''}
</style>
</head>
<body>
<div id="panorama"></div>
<script>${js}</script>
<script>
  try {
    pannellum.viewer('panorama', {
      type: 'equirectangular',
      panorama: ${JSON.stringify(panoRef)},
      autoLoad: true,
      showZoomCtrl: true,
      showFullscreenCtrl: false,
      autoRotate: ${autoRotate ? -2 : 0},
      hfov: 100
    });
  } catch (e) {
    document.body.innerHTML = '<div style="color:#fff;font-family:sans-serif;padding:20px">Panorama error: ' + e + '</div>';
  }
</script>
</body>
</html>`;
        // Write the viewer HTML next to the pano so it loads as a file:// origin.
        const htmlPath = `${FileSystem.cacheDirectory}pano-viewer-${key}.html`;
        await FileSystem.writeAsStringAsync(htmlPath, doc);
        if (!cancelled) setHtmlUri(htmlPath);
      } catch (e) {
        console.log('PanoramaViewer load error', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [imageUrl, autoRotate, isTablet]);

  if (!htmlUri) {
    return (
      <View style={[styles.loading, style]}>
        <ActivityIndicator color="#ffffff" />
        <Text style={styles.loadingText}>Loading panorama…</Text>
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri: htmlUri }}
      style={[styles.web, style]}
      javaScriptEnabled
      domStorageEnabled
      allowFileAccess
      allowFileAccessFromFileURLs
      allowUniversalAccessFromFileURLs
      mixedContentMode="always"
      scrollEnabled={false}
      setBuiltInZoomControls={false}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', gap: 12 },
  loadingText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, letterSpacing: 1 },
  web: { flex: 1, backgroundColor: '#000' },
});
