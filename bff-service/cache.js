class Cache {
  constructor() {
    this.cache = {};
  }

  get(path) {
    return this.cache[path];
  }

  put(path, data, time) {
    this.cache[path] = data;
    setTimeout(() => {
      delete this.cache[path];
    }, time);
  }
}

export default new Cache();
