import { Injectable } from '@nestjs/common';
var cache = require('memory-cache');

@Injectable()
export class CacheService {
  cache = new cache.Cache();

  getCache() {
    return this.cache.get('products');
  }

  setCache(data) {
    return this.cache.put('products', data, 120000);
  }
}
