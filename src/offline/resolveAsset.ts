import { remoteAssetsByName } from './assetMap';

/**
 * Resolves any media reference to a source usable by <Image>/<Video>.
 *
 * The original web app referenced remote Cloudinary URLs everywhere. For the
 * offline build we bundled all of those assets under assets/remote/. This helper
 * takes any original URL (from the bundled JSON or hardcoded in a screen) and
 * returns the bundled require() module id when we have it, else falls back to a
 * { uri } remote source (so nothing hard-crashes if an asset is missing).
 */
export type AssetSource = number | { uri: string };

function basename(url: string): string {
  const noQuery = url.split('?')[0].split('#')[0];
  return noQuery.substring(noQuery.lastIndexOf('/') + 1).trim();
}

export function resolveAsset(url?: string | null): AssetSource | undefined {
  if (!url) return undefined;
  const key = url.trim();
  const name = basename(key);
  const local = remoteAssetsByName[name];
  if (local != null) return local;
  // Not bundled — fall back to streaming (only used if an asset was missed).
  if (/^https?:\/\//.test(key)) return { uri: key };
  return undefined;
}

/** True when the given url is bundled locally (offline-available). */
export function isBundled(url?: string | null): boolean {
  if (!url) return false;
  return remoteAssetsByName[basename(url)] != null;
}
