const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Bundle large media (mp4) as source assets so the offline app can require() them.
config.resolver.assetExts = Array.from(
  new Set([...config.resolver.assetExts, 'mp4', 'png', 'jpg', 'jpeg', 'webp', 'pdf', 'txt'])
);

module.exports = withNativeWind(config, { input: './global.css' });
