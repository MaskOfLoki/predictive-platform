import axios from 'axios';

import { promiseAttempts } from '../utils';
import { GCBackend } from './';

export class GCRPC {
  constructor(private _url: string, protected _backend: GCBackend) {}

  protected async call(method: string, ...params) {
    params.unshift(method);

    while (params[params.length - 1] == null) {
      params.pop();
    }

    let token;

    if (
      this._backend?.firebaseApp &&
      this._backend.firebaseApp.auth().currentUser
    ) {
      token = await this._backend.firebaseApp.auth().currentUser.getIdToken();
    } else {
      token = this._backend.cid;
    }

    const { data } = await promiseAttempts(async () =>
      axios.post(this._url, params, {
        headers: {
          Authorization: token,
        },
      }),
    );
    return data;
  }
}
