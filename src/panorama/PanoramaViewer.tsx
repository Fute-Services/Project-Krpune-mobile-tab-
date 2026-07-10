import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import { resolveAsset } from '../offline/resolveAsset';

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
 * Read a bundled image as a base64 data: URI. WebView on Android cannot reliably
 * read the ExponentAsset file:// cache path ("could not be accessed"), so we
 * inline the bytes instead — fully offline, no file-access flags needed.
 */
async function assetDataUri(mod: number): Promise<string> {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  const uri = asset.localUri || asset.uri;
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' as any });
  return `data:${mimeOf(uri)};base64,${base64}`;
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
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [js, css] = await Promise.all([assetText(pannellumJs), assetText(pannellumCss)]);

        // Resolve the panorama image to an inline base64 data: URI (offline).
        const resolved = resolveAsset(imageUrl);
        let panoUri = imageUrl;
        if (typeof resolved === 'number') panoUri = await assetDataUri(resolved);
        else if (resolved && 'uri' in resolved) panoUri = resolved.uri;

        const doc = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>${css}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}
#panorama{width:100vw;height:100vh;}
</style>
</head>
<body>
<div id="panorama"></div>
<script>${js}</script>
<script>
  try {
    pannellum.viewer('panorama', {
      type: 'equirectangular',
      panorama: ${JSON.stringify(panoUri)},
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
        if (!cancelled) setHtml(doc);
      } catch (e) {
        console.log('PanoramaViewer load error', e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [imageUrl, autoRotate]);

  if (!html) {
    return (
      <View style={[styles.loading, style]}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  }

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
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
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' },
  web: { flex: 1, backgroundColor: '#000' },
});
