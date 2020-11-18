import { cloneObject, deepMerge, isEmptyString, removeNulls, Unwatch } from '../utils';
import { GCBackend } from './';

type StateCallback = (value) => void;

export class GCState {
  private _states: Map<string, any> = new Map();
  private _unsubscribes: Map<string, Unwatch> = new Map();
  private _callbacks: Map<string, StateCallback[]> = new Map();

  constructor(private _backend: GCBackend) {}

  public watch<T>(callback: (value: T) => void, namespace = ''): () => void {
    let callbacks = this._callbacks.get(namespace);

    if (!callbacks) {
      this._callbacks.set(namespace, (callbacks = [callback]));
    }

    const state = this._states.get(namespace);

    if (callbacks.length === 1) {
      this.startWatch(namespace);
    } else if (state) {
      callback(cloneObject(state as T));
    }

    return () => {
      const callbacks = this._callbacks.get(namespace);
      callbacks.splice(callbacks.indexOf(callback), 1);

      if (callbacks.length === 0) {
        this._callbacks.delete(namespace);
        this.stopWatch(namespace);
      }
    };
  }

  private async startWatch(namespace: string) {
    const data: string = await this._backend.redis.get(
      `${this._backend.gid}.${getStateId(namespace)}`,
    );
    let state;

    if (isEmptyString(data)) {
      state = {};
    } else {
      state = JSON.parse(data);
    }

    this._states.set(namespace, state);
    const callbacks = this._callbacks.get(namespace);
    callbacks.forEach((item) => item(cloneObject(state)));

    this._unsubscribes.set(
      namespace,
      this._backend.pubnub.subscribe(
        {
          channel: this.getChannel(namespace),
          withPresence: true,
        },
        this.pubnubHandler.bind(this, namespace),
      ),
    );
  }

  private stopWatch(namespace: string) {
    const unwatch: Unwatch = this._unsubscribes.get(namespace);

    if (unwatch) {
      unwatch();
      this._unsubscribes.delete(namespace);
    }
  }

  private pubnubHandler(namespace: string, m) {
    const state = this._states.get(namespace);
    deepMerge(state, m);
    removeNulls(state);
    const callbacks = this._callbacks.get(namespace);
    callbacks.forEach((item) => item(cloneObject(state)));
  }

  public getChannel(namespace = ''): string {
    return `${this._backend.cid}-${this._backend.gid}-${getStateId(namespace)}`;
  }
}

function getStateId(namespace = ''): string {
  let result = 'state';

  if (!isEmptyString(namespace)) {
    result += `-${namespace}`;
  }

  return result;
}
