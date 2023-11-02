export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function uniqueObjectArray<T>(array: T[], key: keyof T): T[] {
  return array.filter((item, index, self) => {
    return index === self.findIndex((t) => t[key] === item[key]);
  });
}
