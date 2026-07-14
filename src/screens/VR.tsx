import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';
import BackButton from '../components/BackButton';
import { resolveAsset } from '../offline/resolveAsset';
import vrTour from '../offline/data/vr-tour.json';

import pannellumJs from '../../assets/pano/pannellum.js.txt';
import pannellumCss from '../../assets/pano/pannellum.css.txt';
import arrowPng from '../../assets/pano/arrowfinal.png';

/**
 * Native Virtual Tour — full parity with the web VR page. A SINGLE Pannellum
 * viewer holds every scene; navigation happens through in-scene arrow hotspots
 * (rotated to point the right way, click → crossfade to the next scene), exactly
 * like the website. No scene-pill row. The current scene name shows as a badge
 * at the bottom-centre, and a back button sits top-left.
 *
 * All scene switching lives INSIDE the WebView (viewer.loadScene) with the same
 * transition-lock guards the web uses, so rapid clicks can never trigger the
 * black-screen bug and crossfades stay smooth.
 */

async function assetText(mod: number): Promise<string> {
  const asset = Asset.fromModule(mod);
  await asset.downloadAsync();
  return FileSystem.readAsStringAsync(asset.localUri || asset.uri);
}

/** Copy a bundled asset into the cache dir (sibling of the viewer HTML) and
 *  return just its filename, so the file:// WebView can read it by relative
 *  path — no giant base64 inflation. */
async function copyToCache(mod: number, prefix: string): Promise<string | null> {
  try {
    const asset = Asset.fromModule(mod);
    await asset.downloadAsync();
    const uri = asset.localUri || asset.uri;
    const ext = (asset.type || uri.split('.').pop() || 'jpg').replace(/[^a-z0-9]/gi, '');
    const name = `${prefix}_${asset.hash || asset.name}.${ext}`;
    const dest = `${FileSystem.cacheDirectory}${name}`;
    const info = await FileSystem.getInfoAsync(dest);
    if (!info.exists) await FileSystem.copyAsync({ from: uri, to: dest });
    return name;
  } catch {
    return null;
  }
}

// Pretty scene names for the bottom badge (mirrors the web getName map).
const NAME_MAP: Record<string, string> = {
  entrygate: 'GROUND LEVEL',
  dropoff: 'DROP OFF',
  reception: 'RECEPTION',
  cafeteria: 'CAFETERIA',
  'Lift Lobby': 'LIFT LOBBY',
  liftlobby: 'LIFT LOBBY',
  podium1: 'PODIUM 1',
  podium2: 'PODIUM 2',
  terrace: 'MULTIPURPOSE COURT',
  terrace1: 'TERRACE AMENITIES',
  terrace2: 'FOOD COURT',
  terrace_sports: 'SPORTS ZONE',
  retail: 'RETAIL ZONE',
};

export default function VRScreen() {
  const [htmlUri, setHtmlUri] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const buildToken = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const token = ++buildToken.current;

    (async () => {
      try {
        const [js, css] = await Promise.all([assetText(pannellumJs), assetText(pannellumCss)]);
        const arrowRef = (await copyToCache(arrowPng as number, 'vrarrow')) || '';

        const rawScenes = (vrTour as any).scenes || {};
        const firstScene = (vrTour as any).default?.firstScene || Object.keys(rawScenes)[0];

        // Resolve every panorama to a cache-local filename (offline) and flatten
        // each scene's hotspots to the fields the arrow builder needs.
        const sceneDefs: Record<string, any> = {};
        for (const id of Object.keys(rawScenes)) {
          const s = rawScenes[id];
          const resolved = resolveAsset(s.panorama);
          let panoRef = s.panorama;
          if (typeof resolved === 'number') {
            const fn = await copyToCache(resolved, 'pano');
            if (fn) panoRef = fn;
          } else if (resolved && 'uri' in resolved) {
            panoRef = resolved.uri;
          }
          sceneDefs[id] = {
            panorama: panoRef,
            yaw: s.yaw || 0,
            pitch: s.pitch || 0,
            hotSpots: (s.hotSpots || []).map((h: any) => ({
              pitch: h.pitch,
              yaw: h.yaw,
              text: h.createTooltipArgs?.text || '',
              next: h.createTooltipArgs?.next || '',
              rotation: h.createTooltipArgs?.rotation || 0,
            })),
          };
        }

        const doc = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<style>${css}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#000;}
#panorama{width:100vw;height:100vh;}

/* Arrow hotspot (ported from the web VR page). */
.custom-hotspot-main{display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:auto;}
.custom-arrow-asset{width:90px;height:90px;cursor:pointer;display:block;opacity:0.72;
  transition:transform 0.3s ease,opacity 0.2s ease;user-select:none;-webkit-user-drag:none;}
.custom-arrow-asset:active{opacity:1;}
.hotspot-label{visibility:hidden;position:absolute;bottom:100px;background:rgba(0,0,0,0.85);
  color:#fff;padding:8px 16px;border-radius:20px;font-size:14px;white-space:nowrap;font-weight:bold;
  border:1px solid rgba(255,255,255,0.2);pointer-events:none;}
.custom-hotspot-main:active .hotspot-label{visibility:visible;}
.pnlm-hotspot-base{background:none !important;}
.pnlm-load-box,.pnlm-loading{display:none !important;}

/* Scene-name badge (bottom-centre). */
.scene-badge{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
  background:rgba(0,0,0,0.7);color:#fff;padding:10px 28px;border-radius:999px;
  font-size:15px;letter-spacing:1.5px;font-family:sans-serif;z-index:50;
  pointer-events:none;white-space:nowrap;}

/* Zoom controls (right, vertically centred) — matches the web VR page. */
.zoom{position:fixed;right:16px;top:50%;transform:translateY(-50%);
  display:flex;flex-direction:column;gap:12px;z-index:50;}
.zoom button{width:48px;height:48px;border-radius:999px;
  background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.28);
  color:#fff;font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center;}
</style>
</head>
<body>
<div id="panorama"></div>
<div id="badge" class="scene-badge"></div>
<div class="zoom">
  <button id="zin" type="button">+</button>
  <button id="zout" type="button">&#8722;</button>
</div>
<script>${js}</script>
<script>
  var SCENES = ${JSON.stringify(sceneDefs)};
  var NAMES = ${JSON.stringify(NAME_MAP)};
  var ARROW = ${JSON.stringify(arrowRef)};
  var FIRST = ${JSON.stringify(firstScene)};
  var viewer = null;
  var isTransitioning = false;
  var releaseTimer = null;

  function nameOf(id){ return NAMES[id] || id; }
  function setBadge(id){ var b=document.getElementById('badge'); if(b) b.textContent = nameOf(id); }

  // Some hotspot "next" ids in the data don't match a scene key. Known typos are
  // aliased explicitly (podium1's "leftlobby" arrow points at the "Lift Lobby"
  // scene — the panorama file is leftlobby_*, so the author used the wrong id),
  // and anything else is matched tolerantly (case/space-insensitive) so no
  // arrow is ever dead.
  var ALIASES = { leftlobby: 'Lift Lobby' };
  function resolveScene(id){
    if(!id) return null;
    if(SCENES[id]) return id;
    if(ALIASES[id] && SCENES[ALIASES[id]]) return ALIASES[id];
    var norm = id.toLowerCase().replace(/[^a-z0-9]/g,'');
    var keys = Object.keys(SCENES);
    for(var i=0;i<keys.length;i++){
      if(keys[i].toLowerCase().replace(/[^a-z0-9]/g,'') === norm) return keys[i];
    }
    return null;
  }

  // Single, transition-locked entry point for scene changes (web parity):
  // one click -> one loadScene, so rapid clicks can't black-screen the GPU.
  function goToScene(next){
    var target = resolveScene(next);
    if(!viewer || !target) return;
    if(isTransitioning) return;
    if(target === viewer.getScene()) return;
    isTransitioning = true;
    try { viewer.loadScene(target, 'same', 'same', 120); }
    catch(e){ isTransitioning = false; return; }
    setBadge(target);
    if(releaseTimer) clearTimeout(releaseTimer);
    releaseTimer = setTimeout(function(){ isTransitioning = false; }, 2500);
  }

  function createCustomHotspot(div, h){
    div.classList.add('custom-hotspot-main');
    var img = document.createElement('img');
    img.src = ARROW;
    img.className = 'custom-arrow-asset';
    img.style.transform = 'rotate(' + (h.rotation || 0) + 'deg)';
    var span = document.createElement('span');
    span.innerHTML = h.text || '';
    span.className = 'hotspot-label';
    div.appendChild(img);
    div.appendChild(span);
    img.onclick = function(){ goToScene(h.next); };
  }

  var scenesCfg = {};
  Object.keys(SCENES).forEach(function(key){
    var s = SCENES[key];
    scenesCfg[key] = {
      panorama: s.panorama,
      yaw: s.yaw || 0,
      pitch: s.pitch || 0,
      hotSpots: (s.hotSpots || []).map(function(h){
        return {
          pitch: h.pitch,
          yaw: h.yaw,
          type: 'custom',
          createTooltipFunc: (function(hs){ return function(div){ createCustomHotspot(div, hs); }; })(h)
        };
      })
    };
  });

  try {
    viewer = pannellum.viewer('panorama', {
      sceneFadeDuration: 1000,
      default: {
        firstScene: FIRST,
        autoLoad: true,
        autoRotate: -5,
        autoRotateInactivityDelay: 1000,
        showControls: false,
        hfov: 120,
        maxHfov: 120,
        minHfov: 40
      },
      scenes: scenesCfg
    });
    viewer.on('load', function(){
      isTransitioning = false;
      if(releaseTimer){ clearTimeout(releaseTimer); releaseTimer = null; }
      setBadge(viewer.getScene());
    });
    viewer.on('error', function(){ isTransitioning = false; });
    setBadge(FIRST);

    document.getElementById('zin').onclick = function(){
      if(viewer) viewer.setHfov(Math.max(40, viewer.getHfov() - 12));
    };
    document.getElementById('zout').onclick = function(){
      if(viewer) viewer.setHfov(Math.min(120, viewer.getHfov() + 12));
    };
  } catch(e){
    document.body.innerHTML = '<div style="color:#fff;font-family:sans-serif;padding:20px">VR error: ' + e + '</div>';
  }
</script>
</body>
</html>`;

        const htmlPath = `${FileSystem.cacheDirectory}vr-tour.html`;
        await FileSystem.writeAsStringAsync(htmlPath, doc);
        if (!cancelled && token === buildToken.current) setHtmlUri(htmlPath);
      } catch (e) {
        console.log('VR load error', e);
        if (!cancelled && token === buildToken.current) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={styles.root}>
      {htmlUri ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri: htmlUri }}
          style={styles.web}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          mixedContentMode="always"
          scrollEnabled={false}
          setBuiltInZoomControls={false}
        />
      ) : (
        <View style={styles.center}>
          {failed ? (
            <Text style={styles.msg}>Unable to load Virtual Tour</Text>
          ) : (
            <>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingText}>Loading virtual tour…</Text>
            </>
          )}
        </View>
      )}

      <BackButton />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  web: { flex: 1, backgroundColor: '#000' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 12 },
  msg: { color: 'white', fontSize: 16 },
  loadingText: { color: 'rgba(255,255,255,0.7)', fontSize: 13, letterSpacing: 1 },
});
