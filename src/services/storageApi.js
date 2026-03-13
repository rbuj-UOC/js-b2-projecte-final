import Notes from "../models/Notes";

const STORAGE_KEY = "notes_app_storage_v1";

function createMemoryStorage() {
  const data = new Map();

  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
    clear() {
      data.clear();
    }
  };
}

class StorageAPI {
  constructor(storage = window.localStorage) {
    this.storage =
      storage &&
      typeof storage.getItem === "function" &&
      typeof storage.setItem === "function"
        ? storage
        : createMemoryStorage();
  }

  loadNotes() {
    const rawValue = this.storage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return new Notes();
    }

    try {
      const payload = JSON.parse(rawValue);
      if (!Array.isArray(payload)) {
        return new Notes();
      }

      return new Notes().parse(payload);
    } catch (_error) {
      return new Notes();
    }
  }

  saveNotes(noteList) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(noteList.plain()));
  }
}

export default StorageAPI;
