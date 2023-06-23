type CachedValue<T> = {
  maxTime: number;
  timeStamp: number;
  value: T;
};

type CacheOptions = {
  maxTime?: number;
};

export default class CacheAPI {
  public static setLocalItem<T>(key: string, value: T, options: CacheOptions = {}): void {
    const { maxTime = 3600000 } = options;
    const cachedValue: CachedValue<T> = {
      maxTime,
      timeStamp: Date.now(),
      value: value,
    };
    localStorage.setItem(key, JSON.stringify(cachedValue));
  }

  public static getLocalItem<T>(key: string): any | T {
    const cache = localStorage.getItem(key);
    if (cache === null) {
      return cache;
    }
    const cachedValue: CachedValue<T> = JSON.parse(cache);
    if (cachedValue.timeStamp + cachedValue.maxTime < Date.now()) {
      localStorage.removeItem(key);
      return null;
    }
    return cachedValue.value;
  }
}
