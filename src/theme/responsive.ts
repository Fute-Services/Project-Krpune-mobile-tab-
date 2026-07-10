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

export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // Device class is decided by the SHORTEST side (Material "smallest width"), NOT
  // `width`. The app is landscape-locked, so a phone's `width` is its long edge
  // (~800-950dp) which would wrongly read as a tablet. The short edge (a phone's
  // ~360-430dp; a tablet's ~600-800dp) is what actually distinguishes the two.
  // This is purely device-driven so a phone ALWAYS gets the phone layout — it does
  // not depend on any build-time flag (which proved unreliable to inline).
  const shortest = Math.min(width, height);
  const isTablet = shortest >= BREAKPOINTS.tablet;
  const isLarge = shortest >= BREAKPOINTS.large;
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
