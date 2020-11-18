import { IGCLeader } from '../types/IGCLeader';
import { GCBackend } from './';
import { GCRPC } from './GCRPC';

const URL =
  'https://xcite1.azurewebsites.net/api/leaderboards?code=1RawvUYheUytVVXPJNAXMGP5mUSLOwjTEUcmLFNkQ9ixc9eZvEjYVQ==';

export class GCLeaderboards extends GCRPC {
  public static readonly OVERALL: string = 'overall';

  constructor(backend: GCBackend) {
    super(URL, backend);
  }

  public async init<T extends IGCLeader>(
    leaderboard: string,
    update?: Partial<T>,
  ): Promise<T> {
    if (!update) {
      update = {};
    }

    const data: T = await this.call(
      'init',
      this.getLeaderboardId(leaderboard),
      update,
    );
    return data;
  }

  public add(
    points: number,
    leaderboards: string[],
    uid: string,
  ): Promise<IGCLeader[]> {
    return this.call(
      'adminAdd',
      points,
      leaderboards.map(this.getLeaderboardId.bind(this)),
      uid,
    );
  }

  private getLeaderboardId(leaderboard: string): string {
    return `${this._backend.gid}.${leaderboard}`;
  }
}
