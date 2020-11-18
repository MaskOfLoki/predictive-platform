import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';
import { proxy, wrap } from 'comlink';
import * as MiniSignal from 'mini-signals';

import { fillDefaultConfig, IPointsEntry, IQuestionAnswer, IUser } from '../../../../../../common';
import { getIOSVersion, getQueryParam } from '../../../utils';
import { BehaviorMiniSignal } from '../../../utils/BehaviorMiniSignal';
import { loading } from '../../LoadingService';
import { IAPIService } from '../IAPIService';
import { IWorkerService } from './IWorkerService';

export class FirebaseAPIService implements IAPIService {
  public readonly user: MiniSignal = new BehaviorMiniSignal(null);
  public readonly state: MiniSignal = new BehaviorMiniSignal({});
  public readonly overallPosition: MiniSignal = new BehaviorMiniSignal();
  public readonly coupon: MiniSignal = new MiniSignal();
  public readonly config: MiniSignal = new BehaviorMiniSignal(
    fillDefaultConfig(),
  );

  private _worker: IWorkerService;

  private async init(): Promise<void> {
    if (this._worker) {
      return;
    }
    let clientId: string;

    if (!GC_PRODUCTION) {
      clientId = getQueryParam('gcClientId');
    } else {
      clientId = window.location.host.split('.')[0];
    }

    const iOSVersion = getIOSVersion();

    if (iOSVersion && iOSVersion < 12) {
      const module = await loading.wrap(import('./worker'));
      this._worker = new module.WorkerAPIService();
    } else {
      const module = await loading.wrap(import('worker-loader!./worker'));
      // tslint:disable-next-line
      const WorkerAPIClass: any = wrap(new module.default());
      this._worker = await loading.wrap(new WorkerAPIClass());
    }

    this._worker.initCallbacks(
      proxy((value) => this.user.dispatch(value)),
      proxy((value) => this.state.dispatch(value)),
      proxy((value) => this.coupon.dispatch(value)),
      proxy((value) => this.config.dispatch(value)),
    );

    await this._worker.init(clientId);
  }

  public async isLoggedIn(): Promise<IUser> {
    await this.init();
    return loading.wrap(this._worker.isLoggedIn(getQueryParam('uid')));
  }

  public updateUsername(value: string): Promise<boolean> {
    return loading.wrap(this._worker.updateUsername(value));
  }

  public updateUser(value: any): Promise<void> {
    return loading.wrap(this._worker.updateUser(value));
  }

  public submitAnswer(answer: IQuestionAnswer): Promise<void> {
    return loading.wrap(this._worker.submitAnswer(answer));
  }

  public async getSubmittedAnswer(
    questionId: string,
  ): Promise<IQuestionAnswer> {
    return this._worker.getSubmittedAnswer(questionId);
  }

  public getSetLeaders(): Promise<IPointsEntry[]> {
    return loading.wrap(this._worker.getSetLeaders());
  }

  public getEventLeaders(): Promise<IPointsEntry[]> {
    return loading.wrap(this._worker.getEventLeaders());
  }

  public async login(phone: string, email: string): Promise<IUser> {
    await this.init();
    return loading.wrap(this._worker.login(phone, email));
  }

  public async loginAnonymously(): Promise<IUser> {
    await this.init();
    return loading.wrap(this._worker.loginAnonymously());
  }

  public getOverallLeaders(limit?: number): Promise<IPointsEntry[]> {
    return this._worker.getOverallLeaders(limit);
  }

  public getSetPosition(): Promise<IPointsEntry> {
    return this._worker.getSetPosition();
  }

  public getEventPosition(): Promise<IPointsEntry> {
    return this._worker.getEventPosition();
  }

  public async getOverallPosition(): Promise<IPointsEntry> {
    const result = await this._worker.getOverallPosition();
    this.overallPosition.dispatch(result);
    return result;
  }

  public getQuestionAnswers(questionId: string): Promise<IQuestionAnswer[]> {
    return this._worker.getQuestionAnswers(questionId);
  }

  public getUserAnswers(): Promise<IQuestionAnswer[]> {
    return this._worker.getUserAnswers();
  }

  public updateCoupon(coupon: IGCAwardedCoupon, updates: any): Promise<void> {
    return this._worker.updateCoupon(coupon, updates);
  }

  public getCoupons(): Promise<IGCAwardedCoupon[]> {
    return loading.wrap(this._worker.getCoupons());
  }

  public async logout() {
    await loading.wrap(this._worker.logout());
    location.reload();
  }
}
