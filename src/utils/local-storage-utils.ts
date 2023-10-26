const localStorageKeys = [
  "create-spending-item-input",
  "update-spending-item-input",
] as const;

type LocalStorageKey = (typeof localStorageKeys)[number];

export function saveToLocalStorage<T>(key: LocalStorageKey, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage<T>(
  key: LocalStorageKey,
  defaultValue: T | null = null
): T | null {
  const data = localStorage.getItem(key);

  if (!data) {
    return defaultValue;
  }

  return JSON.parse(data);
}

export function removeFromLocalStorage(key: LocalStorageKey) {
  localStorage.removeItem(key);
}
