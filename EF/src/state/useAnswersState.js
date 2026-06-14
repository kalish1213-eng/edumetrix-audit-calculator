import { loadJson, saveJson } from "../utils/storage.js?v=20260614-navsingle1";

export function createAnswersState(storageKey, fallback = {}) {
  let value = loadJson(storageKey, fallback);

  return {
    get value() {
      return value;
    },
    set(nextValue) {
      value = nextValue || {};
      saveJson(storageKey, value);
      return value;
    },
    save(nextValue = value) {
      value = nextValue || {};
      saveJson(storageKey, value);
      return value;
    },
    deleteWhere(predicate) {
      Object.keys(value).forEach((key) => {
        if (predicate(value[key], key)) delete value[key];
      });
      saveJson(storageKey, value);
      return value;
    }
  };
}
