import { gcFirebase } from '@gamechangerinteractive/gc-firebase';
import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';
import { GCConfig } from '@gamechangerinteractive/gc-firebase/GCConfig';
import {
  fixDate,
  isAndroid,
  isIOS,
} from '@gamechangerinteractive/gc-firebase/utils';
import { GCBatchWrapper } from '@gamechangerinteractive/gc-firebase/utils/GCBatchWrapper';
import { expose } from 'comlink';
import firebase from 'firebase/app';
import * as NodeCache from 'node-cache';

// tslint:disable-next-line: max-line-length
import {
  BRANCH,
  CouponStatus,
  fillDefaultConfig,
  GAME_ID,
  getQuestionById,
  getQuestionSetByQuestion,
  IConfig,
  IEvent,
  IGameState,
  IOpenResponseQuestion,
  IPointsEntry,
  IQuestionAnswer,
  IQuestionSet,
  isEmptyString,
  isPollQuestion,
  IUser,
  VERSION,
} from '../../../../../../common';
import { IWorkerService } from './IWorkerService';

class WorkerAPIService implements IWorkerService {
  private _user: IUser;
  private _cache = new NodeCache({
    stdTTL: 10,
  });
  private _userCallback: (value: IUser) => void;
  private _stateCallback: (value: IGameState) => void;
  private _couponCallback: (value: IGCAwardedCoupon) => void;
  private _configCallback: (value: IConfig) => void;

  private _state: IGameState = {};
  private _unwatchState: () => void;

  public initCallbacks(
    userCallback,
    stateCallback,
    couponCallback,
    configCallback,
  ) {
    this._userCallback = userCallback;
    this._stateCallback = stateCallback;
    this._couponCallback = couponCallback;
    this._configCallback = configCallback;
  }

  public init(clientId: string): Promise<void> {
    if (gcFirebase.auth) {
      return;
    }

    const result = gcFirebase.init({
      clientId,
      gameId: GAME_ID,
      version: VERSION,
    });

    gcFirebase.config
      .watch({
        namespace: GCConfig.COMMON,
      })
      .subscribe(this.configHandler.bind(this));

    return result;
  }

  public async isLoggedIn(uid?: string): Promise<IUser> {
    if (isEmptyString(uid)) {
      this._user = (await gcFirebase.auth.isLoggedIn()) as IUser;
    } else {
      this._user = (await gcFirebase.auth.loginUID(uid)) as IUser;
    }

    if (this._user) {
      if (!this._user.phone) {
        await gcFirebase.auth.logout();
        return null;
      }

      this._userCallback(this._user);
      this.watchState();
    }

    return this._user;
  }

  private watchState(): void {
    if (this._unwatchState != null) {
      this._unwatchState();
    }

    const data: any = {
      phone: this._user.phone,
    };

    if (this._user.username) {
      data.username = this._user.username;
    }

    if (this._user.email) {
      data.email = this._user.email;
    }

    if (this._user.additional?.isFiltered !== undefined) {
      data.isFiltered = this._user.additional.isFiltered;
    }

    gcFirebase.leaderboards.initLeaderEntry('overall', data);
    this.watchCoupons();
    this._unwatchState = gcFirebase.games.watchState(
      this.stateHandler.bind(this),
    );
    gcFirebase.database
      .doc(`users/${this._user.uid}`)
      .onSnapshot((snapshot) => {
        this._user = snapshot.data() as IUser;
        this._userCallback(this._user);
      });
  }

  private watchCoupons() {
    gcFirebase.coupons.watch((coupon) => {
      if (coupon.leaderboard) {
        gcFirebase.database
          .doc(
            `statistics/games/${GAME_ID}/leaderboards/${coupon.leaderboard}/${this._user.uid}`,
          )
          .update({
            couponStatus: CouponStatus.DELIVERED,
          });
      }

      this._couponCallback(coupon);
    });
  }

  public async updateUsername(value: string): Promise<boolean> {
    const result = await gcFirebase.auth.isUsernameAvailable(value);

    if (result) {
      this._user.username = value;
      await gcFirebase.auth.setUsername(value);
      gcFirebase.leaderboards.initLeaderEntry('overall', { username: value });
    }

    this._userCallback(this._user);
    return result;
  }

  public async updateUser(value: any): Promise<void> {
    await gcFirebase.database.doc(`users/${this._user.uid}`).update(value);
    const data: any = {};
    if (value.email) {
      data.email = value.email;
    }

    if (value.phone) {
      data.phone = value.phone;
    }

    if (value.username) {
      data.username = value.username;
    }

    if (this._user?.additional?.isFiltered !== undefined) {
      data.isFiltered = this._user.additional.isFiltered;
    }

    await gcFirebase.leaderboards.initLeaderEntry('overall', data);
  }

  public async submitAnswer(answer: IQuestionAnswer): Promise<void> {
    answer.uid = this._user.uid;

    const question = getQuestionById(this._state.event, answer.questionId);
    const questionSet = getQuestionSetByQuestion(this._state.event, question);
    const batch = new GCBatchWrapper(gcFirebase.firebaseApp.firestore());
    const leaderData: any = {};

    if (!isEmptyString(this._user.phone)) {
      leaderData.phone = this._user.phone;
      answer.phone = this._user.phone;
    }

    if (!isEmptyString(this._user.email)) {
      leaderData.email = this._user.email;
      answer.email = this._user.email;
    }

    if (!isEmptyString(this._user.username)) {
      answer.username = this._user.username;
    }

    if (isIOS()) {
      answer.phoneType = 'ios';
    } else if (isAndroid()) {
      answer.phoneType = 'android';
    }

    if (this._user.additional?.isFiltered !== undefined) {
      leaderData.isFiltered = this._user.additional.isFiltered;
    }

    await gcFirebase.leaderboards.initLeaderEntry(
      `${this._state.sessionId}-${questionSet.name}`,
      leaderData,
    );

    if (question && isPollQuestion(question)) {
      const existedAnswer = await this.getSubmittedAnswer(question.id);

      // don't submit poll answer if it was already submitted
      if (existedAnswer) {
        return;
      }

      const points = (question as IOpenResponseQuestion).points;
      await this.addPoints(points, questionSet.name, batch);
    }

    this._cache.set(`answer-${question.id}`, answer, 0);
    this._cache.del('userAnswers');
    this._cache.del(`answers-${question.id}`);
    this._stateCallback(this._state);

    if (answer.wager) {
      await this.addPoints(-answer.wager, questionSet.name, batch);
    }

    await batch.set(
      gcFirebase.database.doc(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${answer.questionId}/${this._user.uid}`,
      ),
      answer,
    );

    await batch.set(
      gcFirebase.database.doc(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/users/${this._user.uid}/${answer.questionId}`,
      ),
      answer,
    );

    await batch.commit();
  }

  public async getSubmittedAnswer(
    questionId: string,
  ): Promise<IQuestionAnswer> {
    let result: IQuestionAnswer = this._cache.get(`answer-${questionId}`);

    if (result) {
      return result;
    }

    const snapshot = await gcFirebase.database
      .doc(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${questionId}/${this._user.uid}`,
      )
      .get();

    if (snapshot.exists) {
      result = snapshot.data() as IQuestionAnswer;
      this._cache.set(`answer-${questionId}`, result, 0);
      this._cache.del('userAnswers');
    }

    return result;
  }

  public async getSetLeaders(): Promise<IPointsEntry[]> {
    const state = await this.getLatestState();

    if (!state || !state.sessionId) {
      return [];
    }

    return this.getLeaders(`${state.sessionId}-${state.latestSetName}`);
  }

  public async getEventLeaders(): Promise<IPointsEntry[]> {
    const state = await this.getLatestState();

    if (!state || !state.sessionId) {
      return [];
    }

    return this.getLeaders(state.sessionId);
  }

  public async getOverallLeaders(limit: number = 10): Promise<IPointsEntry[]> {
    return this.getLeaders('overall', limit);
  }

  public async getSetPosition(): Promise<IPointsEntry> {
    const state = await this.getLatestState();

    if (!state || !state.sessionId) {
      return null;
    }

    return this.getPosition(`${state.sessionId}-${state.latestSetName}`);
  }

  public async getEventPosition(): Promise<IPointsEntry> {
    const state = await this.getLatestState();

    if (!state || !state.sessionId) {
      return null;
    }

    return this.getPosition(state.sessionId);
  }

  public getOverallPosition(): Promise<IPointsEntry> {
    return this.getPosition('overall');
  }

  private async getPosition(
    leaderboard: string = 'overall',
  ): Promise<IPointsEntry> {
    return gcFirebase.leaderboards.getLeaderEntry(leaderboard) as Promise<
      IPointsEntry
    >;
  }

  private async getLeaders(
    leaderboard: string,
    limit: number = 100,
  ): Promise<IPointsEntry[]> {
    let result: IPointsEntry[] = this._cache.get(`leaders-${leaderboard}`);

    if (result && result.length >= limit) {
      return result.slice(0, limit);
    }

    result = (await gcFirebase.leaderboards.getLeaders(
      leaderboard,
      limit,
    )) as IPointsEntry[];
    this._cache.set(`leaders-${leaderboard}`, result);
    return result.slice(0, limit);
  }

  private async addPoints(
    value: number,
    questionSetName: string,
    batch: GCBatchWrapper,
  ) {
    batch.update(gcFirebase.database.doc(`users/${gcFirebase.auth.userId}`), {
      bucks: firebase.firestore.FieldValue.increment(value),
    });

    gcFirebase.leaderboards.addPoints(
      value,
      [
        'overall',
        this._state.sessionId,
        `${this._state.sessionId}-${questionSetName}`,
      ],
      batch,
    );
  }

  private configHandler(value: IConfig) {
    value = fillDefaultConfig(value);
    this._configCallback(value);
  }

  private stateHandler(value?: IGameState): void {
    if (!value) {
      value = {};
    }

    if (value.startTime && value.event) {
      value.startTime = fixDate(value.startTime);
      fixEvent(value.event);
    }

    if (!value.sessionId && this._user.phone) {
      this._cache.flushAll();
      gcFirebase.analytics.stopSession();
    }

    if (
      value.sessionId &&
      value.sessionId !== this._state.sessionId &&
      this._user.phone
    ) {
      const data: any = {
        phone: this._user.phone,
      };

      if (this._user.email) {
        data.email = this._user.email;
      }

      if (this._user.additional?.isFiltered !== undefined) {
        data.isFiltered = this._user.additional.isFiltered;
      }

      gcFirebase.leaderboards.initLeaderEntry(value.sessionId, data);
      gcFirebase.analytics.startSession(value.sessionId);
    }

    this._state = value;
    this._stateCallback(value);
  }

  public async login(phone: string, email: string): Promise<IUser> {
    this._user = (await gcFirebase.auth.loginUID(phone)) as IUser;
    await this.initUser(phone, email);
    return this._user;
  }

  public async loginAnonymously(): Promise<IUser> {
    this._user = (await gcFirebase.auth.loginAnonymously(true)) as IUser;
    gcFirebase.analytics.frontGate();
    this._unwatchState = gcFirebase.games.watchState(
      this.stateHandler.bind(this),
    );
    return this._user;
  }

  public async getQuestionAnswers(
    questionId: string,
  ): Promise<IQuestionAnswer[]> {
    let result: IQuestionAnswer[] = this._cache.get(`answers-${questionId}`);

    if (result && result.length > 0) {
      return result;
    }

    const snapshot = await gcFirebase.database
      .collection(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${questionId}`,
      )
      .limit(100)
      .get();
    result = snapshot.docs.map((doc) => {
      const result = doc.data() as IQuestionAnswer;
      result.uid = doc.id;
      return result;
    });

    this._cache.set(`answers-${questionId}`, result);
    return result;
  }

  public async getUserAnswers(): Promise<IQuestionAnswer[]> {
    let result: IQuestionAnswer[] = this._cache.get('userAnswers');

    if (result) {
      return result;
    }

    const snapshot = await gcFirebase.database
      .collection(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/users/${this._user.uid}`,
      )
      .get();
    result = snapshot.docs.map((doc) => doc.data() as IQuestionAnswer);
    this._cache.set('userAnswers', result);
    return result;
  }

  public updateCoupon(coupon: IGCAwardedCoupon, updates: any): Promise<void> {
    return gcFirebase.database
      .doc(`awarded-coupons/${coupon.id}`)
      .update(updates);
  }

  public async getCoupons(): Promise<IGCAwardedCoupon[]> {
    const snapshot = await gcFirebase.database
      .collection('awarded-coupons')
      .where('uid', '==', this._user.uid)
      .where('gid', '==', GAME_ID)
      .get();

    return snapshot.docs.map((doc) => {
      const result = doc.data() as IGCAwardedCoupon;
      result.time = fixDate(result.time);
      return result;
    });
  }

  public logout() {
    return gcFirebase.auth.logout();
  }

  private async initUser(phone: string, email: string) {
    if (phone.toString().length === 10) {
      phone = `1${phone}`;
    }

    if (!this._user.phone || !this._user.email) {
      this._user.phone = phone;
      this._user.email = email;

      const data: any = {
        phone,
        email,
        bucks: 0,
      };

      if (!isEmptyString(email)) {
        data.email = email;
      }

      await gcFirebase.database.doc(`users/${this._user.uid}`).update(data);
    }

    if (this._user.phone.toString().length === 10) {
      this._user.phone = `1${this._user.phone}`;
      await gcFirebase.database.doc(`users/${this._user.uid}`).update({
        phone: this._user.phone,
      });
    }

    this._userCallback(this._user);
    this.watchState();
  }

  private async getLatestState(): Promise<IGameState> {
    if (this._state.sessionId) {
      return this._state;
    }

    const snapshot = await gcFirebase.games
      .stateCollection()
      .doc('latest')
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data();
  }

  private async getState(): Promise<IGameState> {
    const snapshot = await gcFirebase.games
      .stateCollection()
      .doc('current')
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return snapshot.data();
  }
}

function fixEvent(event: IEvent) {
  if (!event.marketingMessages) {
    event.marketingMessages = [];
  }

  if (!event.marketingMessages) {
    event.marketingMessages = [];
  }

  event.data.forEach((questionSet) => {
    if (questionSet.startTime) {
      questionSet.startTime = fixDate(questionSet.startTime);
    }

    if (questionSet.endTime) {
      questionSet.endTime = fixDate(questionSet.endTime);
    }

    if (questionSet.startedTime) {
      questionSet.startedTime = fixDate(questionSet.startedTime);
    }

    questionSet.questions.forEach((question) => {
      if (question.startTime) {
        question.startTime = fixDate(question.startTime);
      }
    });
  });

  event.data.sort((p1: IQuestionSet, p2: IQuestionSet) => {
    if (!p1.startedTime && !p2.startedTime) {
      return 0;
    } else if (p1.startedTime && !p2.startedTime) {
      return -1;
    } else if (!p1.startedTime && p2.startedTime) {
      return 1;
    } else {
      return p2.startedTime.getTime() - p1.startedTime.getTime();
    }
  });
}

expose(WorkerAPIService);
