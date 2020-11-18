import { GCBackend } from './';
import { GCRPC } from './GCRPC';

const URL =
  'https://xcite1.azurewebsites.net/api/redis-s?code=UKUWmxb/gpjddKgGvV4MmZVFeliFDx3zoyh77/PsnsMwyDpEPD2V0g==';

/**
 *
 *
 * @export
 * @class GCRedis
 */
export class GCRedis extends GCRPC {
  constructor(backend: GCBackend) {
    super(URL, backend);
  }

  /**
   *
   *
   * @returns
   * @memberof GCRedis
   */
  public ping() {
    return this.call('ping');
  }

  /**
   *
   *
   * @param {string} setName
   * @param {number} key
   * @param {string} value
   * @returns
   * @memberof GCRedis
   */
  public zadd(setName: string, key: number, value: string) {
    return this.call('zadd', setName, key, value);
  }

  /**
   *
   *
   * @param {string} setName
   * @param {number} start
   * @param {number} end
   * @param {boolean} [withScores]
   * @returns {Promise<string[]>}
   * @memberof GCRedis
   */
  public zrange(
    setName: string,
    start: number,
    end: number,
    withScores?: boolean,
  ): Promise<string[]> {
    const params = [setName, start, end];

    if (withScores) {
      params.push('WITHSCORES');
    }

    return this.call('zrange', ...params);
  }

  /**
   *
   *
   * @param {string} setName
   * @param {number} start
   * @param {number} end
   * @param {boolean} [withScores]
   * @returns {Promise<string[]>}
   * @memberof GCRedis
   */
  public zrevrange(
    setName: string,
    start: number,
    end: number,
    withScores?: boolean,
  ): Promise<string[]> {
    const params = [setName, start, end];

    if (withScores) {
      params.push('WITHSCORES');
    }

    return this.call('zrevrange', ...params);
  }

  /**
   *
   *
   * @param {string} setName
   * @param {number} key
   * @param {string} value
   * @returns
   * @memberof GCRedis
   */
  public zincrby(setName: string, key: number, value: string) {
    return this.call('zincrby', setName, key, value);
  }

  /**
   *
   *
   * @param {string} setName
   * @param {string} value
   * @returns
   * @memberof GCRedis
   */
  public zscore(setName: string, value: string) {
    return this.call('zscore', setName, value);
  }

  /**
   *
   *
   * @param {string} setName
   * @param {string} value
   * @returns
   * @memberof GCRedis
   */
  public zrank(setName: string, value: string) {
    return this.call('zrank', setName, value);
  }

  /**
   *
   *
   * @param {string} hashName
   * @param {string} key
   * @param {string | number} value
   * @returns
   * @memberof GCRedis
   */
  public hset<T>(hashName: string, key: string, value: T) {
    return this.call('hset', hashName, key, value);
  }

  /**
   *
   *
   * @param {string} hashName
   * @param {string} key
   * @returns {Promise<string | number>}
   * @memberof GCRedis
   */
  public hget<T>(hashName: string, key: string): Promise<T> {
    return this.call('hget', hashName, key);
  }

  /**
   *
   *
   * @param {string} hashName
   * @param {...string[]} keys
   * @returns {Promise<string[]>}
   * @memberof GCRedis
   */
  public hmget(hashName: string, ...keys: string[]): Promise<string[]> {
    const params = [hashName, ...keys];
    return this.call('hmget', ...params);
  }

  public hdel(hash: string, ...keys: string[]): Promise<void> {
    return this.call('hdel', hash, ...keys);
  }

  public get(key: string): Promise<string> {
    return this.call('get', key);
  }

  public set(key: string, value: string): Promise<void> {
    return this.call('set', key, value);
  }

  public del(...key: string[]): Promise<void> {
    if (key.length === 1) {
      return this.call('del', ...key);
    } else {
      // calling del with multiple keys may not work due to redis sharding
      // so instead we're calling del for each key
      return this.batch(...key.map((item) => ['del', item]));
    }
  }

  public rpush(key: string, ...values: string[]) {
    return this.call('rpush', key, ...values);
  }

  public lrange(key: string, start: number, stop: number) {
    return this.call('lrange', key, start, stop);
  }

  public hgetall(key: string) {
    return this.call('hgetall', key);
  }

  public hincrby(hash: string, field: string, value: number) {
    return this.call('hincrby', hash, field, value);
  }

  public sadd(key: string, member: string): Promise<void> {
    return this.call('sadd', key, member);
  }

  public srem(key: string, member: string): Promise<void> {
    return this.call('srem', key, member);
  }

  public srandmember(key: string, count?: number): Promise<string[]> {
    return this.call('srandmember', key, count);
  }

  public keys(pattern: string): Promise<string[]> {
    return this.call('keys', pattern);
  }

  public batch(...commands: any[][]) {
    return this.call('batch', ...commands);
  }
}
