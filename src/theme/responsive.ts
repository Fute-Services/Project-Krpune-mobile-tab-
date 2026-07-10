import { useWindowDimensions } from 'react-native';

/**
 * Central responsive helper. Replaces the web app's `window.innerWidth` +
 * resize-listener branching. Screens use this to switch between phone
 * (single-column) and tablet (wider / multi-column) layouts.
 *
 * Breakpoints:
 *   phone   : < 600dp
 *   tablet  : >= 600dp
 *   large   : >= 900dp (big tablets, landscape)
 */
export const BREAKPOINTS = {
  tablet: 600,
  large: 900,
} as const;

// Build-time variant flag. `mobile` / `tablet` APK builds isko set karte hain
// (EAS profile ya local shell se). Set hone par layout width se decide nahi hota —
// har APK apne device class par lock rehta hai. undefined = dev/Expo Go fallback.
const VARIANT = process.env.EXPO_PUBLIC_APP_VARIANT;

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  let isTablet: boolean;
  let isLarge: boolean;
  if (VARIANT === 'mobile') {
    isTablet = false;
    isLarge = false;
  } else if (VARIANT === 'tablet') {
    isTablet = true;
    isLarge = width >= BREAKPOINTS.large; // large tier bade tablets par bana rahega
  } else {
    // dev / Expo Go: purana width-based behavior (fallback)
    isTablet = width >= BREAKPOINTS.tablet;
    isLarge = width >= BREAKPOINTS.large;
  }
  const isPhone = !isTablet;

  /** Pick a value by device class: select({ phone, tablet, large }). */
  function select<T>(opts: { phone: T; tablet?: T; large?: T }): T {
    if (isLarge && opts.large !== undefined) return opts.large;
    if (isTablet && opts.tablet !== undefined) return opts.tablet;
    return opts.phone;
  }

  /** Scale a base size up on tablets for comfortable touch targets / fonts. */
  function scale(base: number, tabletFactor = 1.3, largeFactor = 1.5): number {
    if (isLarge) return Math.round(base * largeFactor);
    if (isTablet) return Math.round(base * tabletFactor);
    return base;
  }

  return { width, height, isPhone, isTablet, isLarge, isLandscape, select, scale };
}
