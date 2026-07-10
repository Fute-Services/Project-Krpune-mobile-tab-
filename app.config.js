// Dynamic Expo config — per-variant (mobile / tablet) app identity.
// `app.json` base values ka source hai; yahan sirf variant-specific overrides.
// Variant `EXPO_PUBLIC_APP_VARIANT` env se aata hai (EAS profile / local shell).
const VARIANT = process.env.EXPO_PUBLIC_APP_VARIANT ?? 'tablet'; // default tablet
const IS_MOBILE = VARIANT === 'mobile';

module.exports = ({ config }) => ({
  ...config,
  name: IS_MOBILE ? 'KR Pune Mobile' : 'KR Pune',
  slug: 'krpune-native', // SAME slug — EAS project link intact rakho
  android: {
    ...config.android,
    package: IS_MOBILE ? 'com.futeservices.krpune.mobile' : 'com.futeservices.krpune',
  },
  extra: { ...config.extra, appVariant: VARIANT },
});
