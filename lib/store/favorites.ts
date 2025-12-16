
import { create } from 'zustand';

export type FavoriteItem = {
  id: number | string;
  title: string;
  poster?: string;
  year?: number | string;
  type?: string;
};

export type ImportMode = 'merge' | 'replace';

const STORAGE_KEY = 'kinohub:favorites';

function load(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function save(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function smartMerge(existing: FavoriteItem[], incoming: FavoriteItem[]) {
  const map = new Map<string | number, FavoriteItem>();
  existing.forEach(i => map.set(i.id, i));
  incoming.forEach(i => {
    const prev = map.get(i.id);
    map.set(i.id, {
      id: i.id,
      title: i.title || prev?.title || '',
      poster: i.poster || prev?.poster,
      year: i.year || prev?.year,
      type: i.type || prev?.type,
    });
  });
  return Array.from(map.values());
}

type State = {
  items: FavoriteItem[];
  hydrated: boolean;
  hydrate: () => void;
  toggle: (item: FavoriteItem) => void;
  isFavorite: (id: string | number) => boolean;
  exportJSON: () => string;
  importJSON: (json: string, mode?: ImportMode) => void;
};

export const useFavoritesStore = create<State>((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    const items = load();
    set({ items, hydrated: true });
  },

  toggle: (item) => {
    const exists = get().items.some(i => i.id === item.id);
    const updated = exists
      ? get().items.filter(i => i.id !== item.id)
      : [...get().items, item];

    save(updated);
    set({ items: updated });
  },

  isFavorite: (id) => get().items.some(i => i.id === id),

  exportJSON: () => JSON.stringify(get().items, null, 2),

  importJSON: (json, mode = 'merge') => {
    try {
      const parsed = JSON.parse(json);
      if (!Array.isArray(parsed)) return;

      const cleaned = parsed.filter(i => i?.id && i?.title);
      const current = get().items;
      const final = mode === 'replace' ? cleaned : smartMerge(current, cleaned);

      save(final);
      set({ items: final });
    } catch {}
  }
}));
