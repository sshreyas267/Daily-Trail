export type StorageBackend = Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'key' | 'length'>;

export type Store = {
  load: <T>(key: string) => T | null;
  save: (key: string, value: unknown) => void;
};

const ROOT = 'daily-trail:';

export function createMemoryBackend(): StorageBackend {
  const items = new Map<string, string>();
  return {
    get length() {
      return items.size;
    },
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => void items.set(key, value),
    removeItem: (key) => void items.delete(key),
    key: (index) => [...items.keys()][index] ?? null,
  };
}

/** Real browser storage, or memory when the browser blocks it. */
export function defaultBackend(): StorageBackend {
  try {
    const storage = window.localStorage;
    const probe = `${ROOT}probe`;
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return createMemoryBackend();
  }
}

export function createStore(namespace: string, backend: StorageBackend): Store {
  const fullKey = (key: string) => `${ROOT}${namespace}:${key}`;
  return {
    load: <T,>(key: string): T | null => {
      try {
        const raw = backend.getItem(fullKey(key));
        return raw === null ? null : (JSON.parse(raw) as T);
      } catch {
        return null;
      }
    },
    save: (key, value) => {
      try {
        backend.setItem(fullKey(key), JSON.stringify(value));
      } catch {
        // Storage is full or blocked. The game keeps working for this visit.
      }
    },
  };
}

/** Removes everything this game has stored. */
export function clearAll(backend: StorageBackend): void {
  const keys: string[] = [];
  for (let index = 0; index < backend.length; index++) {
    const key = backend.key(index);
    if (key?.startsWith(ROOT)) keys.push(key);
  }
  keys.forEach((key) => backend.removeItem(key));
}
