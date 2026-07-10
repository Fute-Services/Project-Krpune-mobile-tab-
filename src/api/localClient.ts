// Offline replacement for the web app's axios instance.
// The original code did `axiosInstance.get("/floors")` and read `res.data...`.
// Here we return the bundled JSON (captured from the live API) in the exact same
// { data } envelope, so every screen's data-handling logic works unchanged — offline.

import floors from '../offline/data/floors.json';
import amenities from '../offline/data/amenities.json';
import mobility from '../offline/data/mobility.json';
import transport from '../offline/data/transport.json';
import gallery from '../offline/data/gallery.json';
import vrTour from '../offline/data/vr-tour.json';

type AxiosLikeResponse<T = any> = { data: T; status: number };

// Normalise an endpoint (strip base url, leading/trailing slashes) to a key.
function keyOf(endpoint: string): string {
  return endpoint
    .replace(/^https?:\/\/[^/]+\/api/i, '')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();
}

const TABLE: Record<string, unknown> = {
  floors,
  amenities,
  mobility,
  transport,
  gallery,
  'vr-tour': vrTour,
};

async function get<T = any>(endpoint: string): Promise<AxiosLikeResponse<T>> {
  const key = keyOf(endpoint);
  const data = TABLE[key];
  if (data === undefined) {
    throw new Error(`localClient: no bundled data for endpoint "${endpoint}" (key "${key}")`);
  }
  return { data: data as T, status: 200 };
}

const localClient = { get };
export default localClient;
