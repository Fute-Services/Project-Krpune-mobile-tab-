import { useEffect, useState } from 'react';
import localClient from '../api/localClient';

export type Scene = {
  id: string;
  label: string;
  imageUrl: string; // original URL; pass through resolveAsset() for offline source
};

type Item = { _id: string; name: string; image: string };
type Category = { slug: string; items: Item[] };
type ApiResponse = { categories: Category[] };

export const useAmenitiesScenes = (slug: string) => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchScenes = async () => {
      try {
        const res = await localClient.get<ApiResponse[]>('/amenities');
        const category = res.data[0]?.categories?.find((cat) => cat.slug === slug);
        if (!category) {
          if (mounted) setScenes([]);
          return;
        }
        const formatted: Scene[] = category.items.map((item) => ({
          id: item._id,
          label: item.name,
          imageUrl: item.image.trim(),
        }));
        if (mounted) setScenes(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchScenes();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return { scenes, loading };
};
