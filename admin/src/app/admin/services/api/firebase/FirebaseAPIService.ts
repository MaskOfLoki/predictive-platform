import {
  fillDefaultConfig,
  IConfig,
  IEvent,
  IFileData,
  IGameState,
  IOpenResponseQuestion,
  IPointsEntry,
  IQuestion,
  IQuestionAnswer,
  IUser,
  VERSION,
} from '../../../../../../../common';
import { loading } from '../../LoadingService';
import * as MiniSignal from 'mini-signals';
import { BehaviorMiniSignal } from '../../../../utils/BehaviorMiniSignal';
import { IAPIService } from '../IAPIService';
import m from 'mithril';
import APIWorker from 'worker-loader!./worker';
import { proxy, wrap } from 'comlink';
import { IPaginatedLeadersRequest, IPaginatedLeadersResponse } from '../index';
import { ProgressCallback } from '../../../utils';
import {
  cloneObject,
  isEmptyString,
} from '@gamechangerinteractive/gc-firebase/utils';
import { IWorkerAPIService } from '../IWorkerAPIService';
import { Process, processes } from '../../ProcessesService';
import { IGCCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCCoupon';
import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';
import Swal from 'sweetalert2';
import { GCLocalStorage } from '../../../utils/GCLocalStorage';
import { getQueryParam } from '../../../../utils';
import { gcBackend } from '@gamechangerinteractive/xc-backend';
import ENV from '../../../../../../../common/utils/environment';

export const gcLocalStorage: GCLocalStorage = new GCLocalStorage();

// tslint:disable-next-line
const WorkerAPIClass: any = wrap(new APIWorker());

export class FirebaseAPIService implements IAPIService {
  public readonly state: MiniSignal = new BehaviorMiniSignal({});
  public readonly auth: MiniSignal = new BehaviorMiniSignal(false);
  public readonly userCount: MiniSignal = new BehaviorMiniSignal(0);
  public readonly config: MiniSignal = new BehaviorMiniSignal(
    fillDefaultConfig(),
  );

  private _worker: IWorkerAPIService;
  private _state: IGameState = {};

  public async init(): Promise<boolean> {
    try {
      this._worker = await loading.wrap(new WorkerAPIClass());
      this.initWorkerCallbacks();
      const cid = await gcLocalStorage.getItem<string>('gc.cid');
      const secret = await gcLocalStorage.getItem<string>('gc.sid');

      if (
        isEmptyString(cid) ||
        isEmptyString(secret) ||
        !(await this.login(cid, secret))
      ) {
        this.showLoginSettings();
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  public async login(clientId: string, secret?: string): Promise<boolean> {
    await gcBackend.init({
      cid: clientId,
      gid: 'predictive-platform',
      admin: true,
      env: ENV,
      buildNum: VERSION,
    });
    const results: boolean[] = await loading.wrap(
      Promise.all([
        this._worker.login(clientId, secret, getQueryParam('xeo')),
        gcBackend.auth.loginUID(secret),
      ]),
    );

    const success = results.filter((value) => !value).length === 0;

    if (success) {
      await gcLocalStorage.setItem<string>('gc.sid', secret);
    }

    return success;
  }

  public async showLoginSettings(reload?: boolean) {
    const cid: string = await gcLocalStorage.getItem<string>('gc.cid');

    await Swal.fire({
      title: 'Settings',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Client ID" value="${
          cid || ''
        }">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Client Secret">`,
      focusConfirm: false,
      preConfirm: this.settingsPreConfirmHandler.bind(this, reload),
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
  }

  private async settingsPreConfirmHandler(reload?: boolean): Promise<void> {
    Swal.resetValidationMessage();
    const id = (document.getElementById(
      'swal-input1',
    ) as HTMLInputElement).value.trim();

    if (isEmptyString(id)) {
      Swal.showValidationMessage('Client ID is empty');
      return;
    }

    const secret = (document.getElementById(
      'swal-input2',
    ) as HTMLInputElement).value.trim();

    if (isEmptyString(secret)) {
      Swal.showValidationMessage('Client Secret is empty');
      return;
    }

    const isAdmin = await this.login(id, secret);

    if (isAdmin) {
      await gcLocalStorage.setItem('gc.cid', id);

      if (reload) {
        location.reload();
      }
    } else {
      Swal.showValidationMessage('Invalid Client ID or Client Secret');
    }
  }

  private initWorkerCallbacks(): void {
    this._worker.initCallbacks(
      proxy((value) => wrapRedraw(() => this.auth.dispatch(value))),
      proxy((value) => wrapRedraw(() => this.userCount.dispatch(value))),
      proxy((value) => wrapRedraw(() => this.stateHandler(value))),
      proxy((value) => wrapRedraw(() => this.config.dispatch(value))),
    );
  }

  private stateHandler(value: IGameState) {
    this._state = value;
    this.state.dispatch(value);
  }

  public getEvents(): Promise<IEvent[]> {
    return this._worker.getEvents();
  }

  public async addEvent(value: IEvent): Promise<IEvent> {
    await loading.wrap(this._worker.addEvent(value));
    return value;
  }

  public saveEvent(event: IEvent) {
    return loading.wrap(this._worker.saveEvent(event));
  }

  public deleteEvent(event: IEvent) {
    return loading.wrap(this._worker.deleteEvent(event));
  }

  public startEvent(event: IEvent): Promise<void> {
    return loading.wrap(this._worker.startEvent(event));
  }

  public stopEvent(): Promise<void> {
    return loading.wrap(this._worker.stopEvent());
  }

  public awardQuestion(
    question: IQuestion,
    progressCallback: ProgressCallback,
  ): Promise<number> {
    return processes.start(
      Process.AWARD,
      this._worker.awardQuestion(question, proxy(progressCallback)),
    );
  }

  public revertQuestionAward(
    question: IOpenResponseQuestion,
    progressCallback: ProgressCallback,
  ): Promise<void> {
    return processes.start(
      Process.AWARD,
      loading.wrap(
        this._worker.revertQuestionAward(question, proxy(progressCallback)),
      ),
    );
  }

  public pushQuestion(question: IQuestion): Promise<number> {
    return this._worker.pushQuestion(question);
  }

  public makeLive(question: IOpenResponseQuestion): Promise<void> {
    return loading.wrap(this._worker.makeLive(question));
  }

  public updateState(value?: IGameState): Promise<void> {
    return loading.wrap(this._worker.updateState(this._state));
  }

  public saveConfig(config: IConfig): Promise<void> {
    return loading.wrap(this._worker.saveConfig(config));
  }

  public getUserPhone(uid: string): Promise<string> {
    return this._worker.getUserPhone(uid);
  }

  public resetPrizeHolders(leaderboards?: string[]): Promise<void> {
    return processes.start(
      Process.RESET,
      this._worker.resetPrizeHolders(leaderboards),
    );
  }

  public removeFile(path: string): Promise<void> {
    return loading.wrap(this._worker.removeFile(path));
  }

  // tslint:disable-next-line: max-line-length
  public updateUserAnswers(
    question: IQuestion,
    index: number,
    newAnswer: string,
    progressCallback: ProgressCallback,
  ): Promise<number> {
    return this._worker.updateUserAnswers(
      question,
      index,
      newAnswer,
      proxy(progressCallback),
    );
  }

  public uploadFile(name: string, file: File): Promise<IFileData> {
    return loading.wrap(this._worker.uploadFile(name, file));
  }

  public getEventLeaders(
    sessionId: string,
    limit?: number,
  ): Promise<IPointsEntry[]> {
    return this._worker.getEventLeaders(sessionId, limit);
  }

  public getOverallLeaders(limit?: number): Promise<IPointsEntry[]> {
    return this._worker.getOverallLeaders(limit);
  }

  public getSetLeaders(
    sessionId: string,
    setName: string,
    limit?: number,
  ): Promise<IPointsEntry[]> {
    return this._worker.getSetLeaders(sessionId, setName, limit);
  }

  public getLatestGame(): Promise<IGameState> {
    return loading.wrap(this._worker.getLatestGame());
  }

  public async getQuestionAnswers(
    questionId: string,
  ): Promise<IQuestionAnswer[]> {
    const limit = 1000;
    const [users, result] = await loading.wrap(
      Promise.all([
        this._worker.getOnlineUsers(),
        this._worker.getQuestionAnswers(questionId, limit),
      ]),
    );

    const len = users.length;
    // to avoid app hangs for huge amount of users we interpolate 1000 answers to all users
    if (len > limit && result.length === limit) {
      let index = 0;

      while (result.length < len) {
        result.push(cloneObject(result[index]));
        index++;

        if (index === limit) {
          index = 0;
        }
      }
    }

    return result;
  }

  public getQuestionAnswerCount(questionId: string): Promise<number> {
    return this._worker.getQuestionAnswerCount(questionId);
  }

  public getCoupons(): Promise<IGCCoupon[]> {
    return loading.wrap(this._worker.getCoupons());
  }

  public awardCoupon(
    coupon: IGCCoupon,
    users: IPointsEntry[],
    leaderboard: string,
  ): Promise<IGCAwardedCoupon[]> {
    return processes.start(
      Process.AWARD,
      loading.wrap(this._worker.awardCoupon(coupon, users, leaderboard)),
    );
  }

  public getPaginatedLeaders(
    request: IPaginatedLeadersRequest,
  ): Promise<IPaginatedLeadersResponse> {
    return loading.wrap(this._worker.getPaginatedLeaders(request));
  }

  public getAllPaginatedLeaders(): Promise<IPointsEntry[]> {
    return loading.wrap(this._worker.getAllPaginatedLeaders());
  }

  public getRegisteredUsers(): Promise<IUser[]> {
    return loading.wrap(this._worker.getRegisteredUsers());
  }
}

function wrapRedraw(callback) {
  callback();
  m.redraw();
}
