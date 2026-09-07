import createIndexedDBStorage from "redux-persist-indexeddb-storage";

const memoryStore = new Map();

const createMemoryStorage = () => ({
  getItem: (key) => Promise.resolve(memoryStore.get(key) ?? null),
  setItem: (key, value) => {
    memoryStore.set(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    memoryStore.delete(key);
    return Promise.resolve();
  },
});

const createLocalStorageFallback = () => ({
  getItem: (key) => {
    if (typeof window === "undefined" || !window.localStorage) {
      return Promise.resolve(memoryStore.get(key) ?? null);
    }
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key, value) => {
    if (typeof window === "undefined" || !window.localStorage) {
      memoryStore.set(key, value);
      return Promise.resolve(value);
    }
    window.localStorage.setItem(key, value);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    if (typeof window === "undefined" || !window.localStorage) {
      memoryStore.delete(key);
      return Promise.resolve();
    }
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
});

export default function createResilientPersistStorage(dbName) {
  let indexedDbStorage;
  try {
    indexedDbStorage = createIndexedDBStorage(dbName);
  } catch {
    indexedDbStorage = null;
  }

  const localStorageFallback = createLocalStorageFallback();
  const memoryStorage = createMemoryStorage();

  const runWithFallback = async (method, args) => {
    if (indexedDbStorage?.[method]) {
      try {
        return await indexedDbStorage[method](...args);
      } catch {
        // Browser privacy settings/extensions can disable IndexedDB.
      }
    }

    try {
      return await localStorageFallback[method](...args);
    } catch {
      return memoryStorage[method](...args);
    }
  };

  return {
    getItem: (...args) => runWithFallback("getItem", args),
    setItem: (...args) => runWithFallback("setItem", args),
    removeItem: (...args) => runWithFallback("removeItem", args),
  };
}
