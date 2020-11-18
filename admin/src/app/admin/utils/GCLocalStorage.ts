import * as localforage from 'localforage';

const isSupported: boolean =
    localforage.supports(localforage.INDEXEDDB) ||
    localforage.supports(localforage.WEBSQL) ||
    localforage.supports(localforage.LOCALSTORAGE);

/**
 *
 *
 * @export
 * @class GCLocalStorage
 * @implements {ILocalStorage}
 */
export class GCLocalStorage implements ILocalStorage {
    private readonly _adapter: ILocalStorage = isSupported ? localforage : new FakeLocalStorage();

    /**
     *
     *
     * @returns {Promise<void>}
     * @memberof GCLocalStorage
     */
    public clear(): Promise<void> {
        return this._adapter.clear();
    }

    /**
     *
     *
     * @template T
     * @param {string} key
     * @returns {Promise<T>}
     * @memberof GCLocalStorage
     */
    public getItem<T>(key: string): Promise<T> {
        return this._adapter.getItem(key);
    }

    /**
     *
     *
     * @template T
     * @param {string} key
     * @param {T} value
     * @returns {Promise<T>}
     * @memberof GCLocalStorage
     */
    public setItem<T>(key: string, value: T): Promise<T> {
        return this._adapter.setItem(key, value);
    }

    /**
     *
     *
     * @param {string} key
     * @returns {Promise<void>}
     * @memberof GCLocalStorage
     */
    public removeItem(key: string): Promise<void> {
        return this._adapter.removeItem(key);
    }
}

interface ILocalStorage {
    getItem<T>(key: string): Promise<T>;
    setItem<T>(key: string, value: T): Promise<T>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
}

class FakeLocalStorage implements ILocalStorage {
    public clear(): Promise<void> {
        return Promise.resolve();
    }

    public getItem<T>(key: string): Promise<T> {
        return Promise.resolve(undefined);
    }

    public setItem<T>(key: string, value: T): Promise<T> {
        return Promise.resolve(value);
    }

    public removeItem(key: string): Promise<void> {
        return Promise.resolve();
    }
}
