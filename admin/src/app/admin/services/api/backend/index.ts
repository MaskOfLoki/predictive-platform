import { GCFirebase } from '@gamechangerinteractive/gc-firebase';
import { GCDatabaseGlobal } from '@gamechangerinteractive/gc-firebase/GCDatabaseGlobal';

import { GCLeaderboards } from './GCLeaderboards';
import { GCPubNub } from './GCPubNub';
import { GCRedis } from './GCRedis';
import { GCState } from './GCState';

export class GCBackend {
  private _leaderboards: GCLeaderboards;
  private _pubnub: GCPubNub;
  private _redis: GCRedis;
  private _state: GCState;

  constructor(
    private _cid: string,
    private _gid: string,
    private _gcFirebase: GCFirebase,
    publishKey: string,
    subscribeKey: string,
  ) {
    this._leaderboards = new GCLeaderboards(this);
    this._pubnub = new GCPubNub({ publishKey, subscribeKey });
    this._redis = new GCRedis(this);
    this._state = new GCState(this);
  }

  public get cid(): string {
    return this._cid;
  }

  public get firestore(): GCDatabaseGlobal {
    return this._gcFirebase.database;
  }

  public get firebaseApp(): firebase.app.App {
    return this._gcFirebase.firebaseApp;
  }

  public get gid(): string {
    return this._gid;
  }

  public get leaderboards(): GCLeaderboards {
    return this._leaderboards;
  }

  public get redis(): GCRedis {
    return this._redis;
  }

  public get pubnub(): GCPubNub {
    return this._pubnub;
  }

  public get state(): GCState {
    return this._state;
  }
}
