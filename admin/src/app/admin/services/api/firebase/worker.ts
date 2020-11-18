import { gcFirebase } from '@gamechangerinteractive/gc-firebase';
import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';
import { IGCCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCCoupon';
import { GCConfig } from '@gamechangerinteractive/gc-firebase/GCConfig';
import { fixDate, uuid } from '@gamechangerinteractive/gc-firebase/utils';
import { GCBatchWrapper } from '@gamechangerinteractive/gc-firebase/utils/GCBatchWrapper';
import { expose } from 'comlink';
import firebase from 'firebase/app';

import {
  BRANCH,
  CouponStatus,
  Feature,
  fillDefaultConfig,
  GAME_ID,
  getQuestionById,
  getQuestionSetByQuestion,
  IBetMoneylineQuestion,
  IBetOverUnderQuestion,
  IBetPropQuestion,
  IConfig,
  IEvent,
  IFileData,
  IGameState,
  IOpenResponseQuestion,
  IPointsEntry,
  IQuestion,
  IQuestionAnswer,
  IQuestionSet,
  isEmptyString,
  IUser,
  QuestionType,
  VERSION,
} from '../../../../../../../common';
import { Profanity } from '../../../../utils/profanity';
import { ProgressCallback } from '../../../utils';
import { GCBackend } from '../backend';
import { IPaginatedLeadersRequest, IPaginatedLeadersResponse } from '../index';
import { IWorkerAPIService } from '../IWorkerAPIService';

interface IQuestionWithAnswers extends IQuestion {
  answers: string[];
}

interface IAnswerCountRequest {
  sessionId: string;
  questionId: string;
  resolution: (_: number) => void;
  rejection: (_: any) => void;
}

class WorkerAPIService implements IWorkerAPIService {
  private _authCallback;
  private _userCountCallback;
  private _stateCallback;
  private _configCallback;

  private _xeoLeaderboard: string;
  private _backend: GCBackend;

  private _state: IGameState = {};
  private _config: IConfig = fillDefaultConfig();
  // uid -> phone
  private _cachedPhones: Map<string, string> = new Map<string, string>();
  private _isPrizeHoldersResetRunning: boolean;
  private _paginatedLeaders: IPointsEntry[] = [];
  private _cachedLatestState: IGameState;
  private _answerCountRequests: IAnswerCountRequest[] = [];
  private _answerCountTimeout: any;

  public initCallbacks(
    authCallback,
    userCountCallback,
    stateCallback,
    configCallback,
  ) {
    this._authCallback = authCallback;
    this._userCountCallback = userCountCallback;
    this._stateCallback = stateCallback;
    this._configCallback = configCallback;
  }

  public async login(
    cid: string,
    secret: string,
    isXeo?: string,
  ): Promise<boolean> {
    try {
      await gcFirebase.init({
        clientId: cid,
        gameId: GAME_ID,
        version: VERSION,
      });
    } catch (e) {
      console.error(e);
      return false;
    }

    if (isEmptyString(secret)) {
      const isLoggedIn = await gcFirebase.auth.isLoggedIn();

      if (!isLoggedIn) {
        return false;
      }
    } else {
      await gcFirebase.auth.loginUID(secret);
    }

    const isAdmin = await gcFirebase.auth.isAdmin();

    if (isAdmin) {
      if (isXeo) {
        this._backend = new GCBackend(
          cid,
          'xeo',
          gcFirebase,
          'pub-c-85b349ec-dab9-4a15-95b0-5783e2e0ba0c',
          'sub-c-9c03b4ca-82e5-11ea-8dff-bafe0457d467',
        );
        this._backend.pubnub.init(gcFirebase.auth.userId);
        this._backend.state.watch((state: any) => {
          if (state && state.sid) {
            this._xeoLeaderboard = state.sid;
          }
        });
      }
      this._authCallback(true);
      gcFirebase.games.watchState(this.stateHandler.bind(this));
      gcFirebase.config
        .watch({
          namespace: GCConfig.COMMON,
        })
        .subscribe(this.configHandler.bind(this));
      gcFirebase.analytics.watchOnlineUsers(
        (ids) => this._userCountCallback(ids.length),
        1000,
      );
    }

    return isAdmin;
  }

  private configHandler(value: IConfig) {
    value = fillDefaultConfig(value);
    this._config = value;
    this._configCallback(value);
  }

  private stateHandler(value: IGameState): void {
    if (!value) {
      value = {};
    }

    // startTime isn't set yet, need to wait for a couple of ms
    if (value.sessionId && !value.startTime) {
      return;
    }

    if (value.startTime) {
      value.startTime = fixDate(value.startTime);
    }

    if (value.event) {
      fixEvent(value.event);
    }

    this._state = value;
    this._stateCallback(value);
  }

  public async getEvents(): Promise<IEvent[]> {
    const result: IEvent[] = (await gcFirebase.games.getGameData()) as IEvent[];
    result.forEach(fixEvent);
    return result.filter((event) => !!event.type);
  }

  public async addEvent(value: IEvent): Promise<IEvent> {
    await gcFirebase.games.addGameData(value);
    return value;
  }

  public async saveEvent(event: IEvent) {
    const isEventStarted: boolean =
      !!this._state.sessionId && event.id === this._state.event.id;

    if (isEventStarted) {
      await gcFirebase.games.updateGameState({
        event,
      });
    } else {
      fixQuestions(event);
    }

    await gcFirebase.games.addGameData(event);
  }

  public async deleteEvent(event: IEvent) {
    await gcFirebase.games.removeGameData(event.id);
  }

  public async startEvent(event: IEvent): Promise<void> {
    fixQuestions(event);
    const sessionId = uuid();

    gcFirebase.analytics.startGame({
      sessionId,
    });

    return gcFirebase.games.updateGameState({
      sessionId,
      event,
      startTime: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  public async stopEvent(): Promise<void> {
    this._cachedLatestState = this._state;
    gcFirebase.analytics.stopGame({
      sessionId: this._state.sessionId,
    });

    await Promise.all([
      gcFirebase.games.stateCollection().doc('latest').set(this._state),
      gcFirebase.games
        .stateCollection()
        .doc(this._state.sessionId)
        .set(this._state),
    ]);

    return gcFirebase.games.updateGameState({
      sessionId: firebase.firestore.FieldValue.delete(),
      event: firebase.firestore.FieldValue.delete(),
      startTime: firebase.firestore.FieldValue.delete(),
      latestSetName: firebase.firestore.FieldValue.delete(),
    });
  }

  public async revertQuestionAward(
    value: IOpenResponseQuestion,
    progressCallback: ProgressCallback,
  ) {
    const question = getQuestionById(
      this._state.event,
      value.id,
    ) as IOpenResponseQuestion;

    const snapshot = await gcFirebase.database
      .collection(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${question.id}`,
      )
      .where('answer', '==', question.correctAnswer)
      .get();

    const playerAnswers = snapshotToPlayerAnswers(snapshot);
    playerAnswers.forEach((item) => (item.payout = -item.payout));
    await this.awardResponseQuestion(value, playerAnswers, progressCallback);
  }

  public async awardQuestion(
    value: IQuestion,
    progressCallback: ProgressCallback,
  ): Promise<number> {
    const question = getQuestionById(this._state.event, value.id);
    const questionSet: IQuestionSet = getQuestionSetByQuestion(
      this._state.event,
      question,
    );
    question.awarded = true;

    if ((value as IOpenResponseQuestion).correctAnswer != null) {
      (question as IOpenResponseQuestion).correctAnswer = (value as IOpenResponseQuestion).correctAnswer;
    }

    if ((value as IBetMoneylineQuestion).winner) {
      (question as IBetMoneylineQuestion).winner = (value as IBetMoneylineQuestion).winner;
    }

    await gcFirebase.games.updateGameState({
      event: this._state.event,
      latestSetName: questionSet.name,
    });

    switch (question.type) {
      case QuestionType.QUESTION_MULTIPLE_CHOICE:
      case QuestionType.QUESTION_OPEN_RESPONSE: {
        const q = question as IOpenResponseQuestion;
        const snapshot = await gcFirebase.database
          .collection(
            // tslint:disable-next-line
            `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${question.id}`,
          )
          .where('answer', '==', q.correctAnswer)
          .get();
        return this.awardResponseQuestion(
          q,
          snapshotToPlayerAnswers(snapshot),
          progressCallback,
        );
      }
      case QuestionType.BET_MONEYLINE:
      case QuestionType.BET_POINT_SPREAD:
      case QuestionType.BET_OVER_UNDER: {
        const q = question as IBetMoneylineQuestion;
        const snapshot = await gcFirebase.database
          .collection(
            // tslint:disable-next-line
            `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${question.id}`,
          )
          .where('team', '==', q.winner)
          .get();

        return this.awardBetQuestion(
          q,
          snapshotToPlayerAnswers(snapshot),
          progressCallback,
        );
      }
      case QuestionType.BET_PROP: {
        const snapshot = await gcFirebase.database
          .collection(
            // tslint:disable-next-line
            `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${question.id}`,
          )
          .get();

        return this.awardBetPropQuestion(
          question as IBetPropQuestion,
          snapshotToPlayerAnswers(snapshot),
          progressCallback,
        );
      }
    }
  }

  public async pushQuestion(question: IQuestion): Promise<number> {
    question = getQuestionById(this._state.event, question.id);
    question.awarded = true;
    question.pushed = true;

    await gcFirebase.games.updateGameState({
      event: this._state.event,
    });

    const playerAnswers: IQuestionAnswer[] = await this.getQuestionAnswers(
      question.id,
    );

    switch (question.type) {
      case QuestionType.BET_MONEYLINE:
      case QuestionType.BET_POINT_SPREAD:
      case QuestionType.BET_OVER_UNDER:
      case QuestionType.BET_PROP: {
        return this.pushBetQuestion(
          question as IBetMoneylineQuestion,
          playerAnswers,
        );
      }
    }
  }

  public async makeLive(question: IOpenResponseQuestion): Promise<void> {
    if (!this._state.sessionId) {
      return;
    }

    question = getQuestionById(
      this._state.event,
      question.id,
    ) as IOpenResponseQuestion;
    question.startTime = new Date();
    await gcFirebase.games.updateGameState({
      event: this._state.event,
    });
  }

  public updateState(value?: IGameState): Promise<void> {
    return gcFirebase.games.updateGameState(value);
  }

  public saveConfig(config: IConfig): Promise<void> {
    return gcFirebase.config.update(config, {
      namespace: GCConfig.COMMON,
    });
  }

  private async innerAwardQuestion(
    question: IQuestion,
    playerAnswers: IQuestionAnswer[],
    // tslint:disable-next-line
    validateFn: (question: IQuestion, answer: IQuestionAnswer) => boolean,
    progressCallback: ProgressCallback,
  ): Promise<number> {
    const event = this._state.event;
    let batch = gcFirebase.firebaseApp.firestore().batch();
    playerAnswers = playerAnswers.filter((answer) =>
      validateFn(question, answer),
    );
    const total = playerAnswers.length;
    let current = 0;
    progressCallback({
      current,
      total,
    });

    let currentBatchAnswers = [];
    const questionSet = getQuestionSetByQuestion(event, question);

    for (const answer of playerAnswers) {
      currentBatchAnswers.push(answer);
      this.addPoints(answer.uid, answer.payout, questionSet.name, batch);
      current++;

      if (batch['_mutations'].length > 490) {
        await batch
          .commit()
          .then(() => (currentBatchAnswers = []))
          .catch((error) => {
            // ignore batch error
            console.warn(error);
            this.handleFallbackAward(currentBatchAnswers, event, questionSet);
            currentBatchAnswers = [];
          });
        progressCallback({
          current,
          total,
        });
        batch = gcFirebase.firebaseApp.firestore().batch();
      }
    }

    if (batch['_mutations'].length > 0) {
      await batch.commit().catch((error) => {
        // ignore batch error
        console.warn(error);
        this.handleFallbackAward(currentBatchAnswers, event, questionSet);
        currentBatchAnswers = [];
      });
    }

    progressCallback({
      current: total,
      total,
    });

    this.notifyXeo();

    return total;
  }

  private notifyXeo() {
    if (this._backend) {
      this._backend.pubnub.publish({
        channel: `${this._backend.cid}.${this._backend.gid}.leaderboard`,
        message: 'update',
      });
    }
  }

  // tslint:disable-next-line: max-line-length
  private async handleFallbackAward(
    batch: IQuestionAnswer[],
    event: IEvent,
    qset: IQuestionSet,
  ) {
    if (batch.length === 0) {
      return;
    }

    const answer = batch.pop();
    await this.fallbackAddPoints(answer.uid, answer.payout, qset.name);
    this.notifyXeo();
    setTimeout(this.handleFallbackAward.bind(this, batch, event, qset), 0);
  }

  private awardBetQuestion(
    question: IBetMoneylineQuestion,
    playerAnswers: IQuestionAnswer[],
    progressCallback: ProgressCallback,
  ): Promise<number> {
    return this.innerAwardQuestion(
      question,
      playerAnswers,
      (question: IBetMoneylineQuestion, answer) =>
        answer.team === question.winner,
      progressCallback,
    );
  }

  private awardBetPropQuestion(
    question: IBetPropQuestion,
    playerAnswers: IQuestionAnswer[],
    progressCallback: ProgressCallback,
  ): Promise<number> {
    return this.innerAwardQuestion(
      question,
      playerAnswers,
      (question: IBetPropQuestion, answer) =>
        question.outcomes.findIndex((item) => item.text === answer.answer) ===
        question.correctAnswer,
      progressCallback,
    );
  }

  private awardResponseQuestion(
    question: IOpenResponseQuestion,
    playerAnswers: IQuestionAnswer[],
    progressCallback: ProgressCallback,
  ): Promise<number> {
    return this.innerAwardQuestion(
      question,
      playerAnswers,
      () => true,
      progressCallback,
    );
  }

  private async pushBetQuestion(
    question: IQuestion,
    playerAnswers: IQuestionAnswer[],
  ): Promise<number> {
    const questionSet = getQuestionSetByQuestion(this._state.event, question);
    let batch = gcFirebase.firebaseApp.firestore().batch();

    for (const answer of playerAnswers) {
      this.addPoints(answer.uid, answer.wager, questionSet.name, batch);

      if (batch['_mutations'].length > 490) {
        await batch.commit();
        batch = gcFirebase.firebaseApp.firestore().batch();
      }
    }

    if (batch['_mutations'].length > 0) {
      batch.commit();
    }

    this.notifyXeo();

    return playerAnswers.length;
  }

  public async getUserPhone(uid: string): Promise<string> {
    let result = this._cachedPhones.get(uid);

    if (!isEmptyString(result)) {
      return result;
    }

    const snapshot = await gcFirebase.database.doc(`users/${uid}`).get();

    if (snapshot.exists) {
      result = snapshot.data().phone;
    }

    if (!isEmptyString(result)) {
      this._cachedPhones.set(uid, result);
    }

    return result;
  }

  public async resetPrizeHolders(leaderboards?: string[]): Promise<void> {
    if (this._isPrizeHoldersResetRunning) {
      return;
    }

    this._isPrizeHoldersResetRunning = true;
    let resetAll = false;

    if (!leaderboards) {
      resetAll = true;
      leaderboards = ['overall'];
      const game: IGameState = await this.getLatestGame();

      if (game) {
        leaderboards.push(game.sessionId);
        game.event.data.forEach((questionSet) =>
          leaderboards.push(`${game.sessionId}-${questionSet.name}`),
        );
        gcFirebase.games.stateCollection().doc('latest').delete();
      }
    }

    await gcFirebase.leaderboards.resetLeaders(leaderboards, {
      couponStatus: firebase.firestore.FieldValue.delete(),
    });

    if (!resetAll) {
      this._isPrizeHoldersResetRunning = false;
      return;
    }

    // Reset positive user bucks to zero
    let users = await gcFirebase.database
      .collection('users')
      .where('bucks', '>', 0)
      .get();

    await this.resetUserBucks(users);

    // Reset negative user bucks to zero
    users = await gcFirebase.database
      .collection('users')
      .where('bucks', '<', 0)
      .get();

    await this.resetUserBucks(users);

    this._isPrizeHoldersResetRunning = false;
  }

  private async resetUserBucks(
    snapshot: firebase.firestore.QuerySnapshot,
  ): Promise<void> {
    const batch = new GCBatchWrapper(gcFirebase.firebaseApp.firestore());

    for (const doc of snapshot.docs) {
      await batch.update(doc.ref, { bucks: 0 });
    }

    await batch.commit();
  }

  public removeFile(path: string): Promise<void> {
    return gcFirebase.storage.delete(path);
  }

  // tslint:disable-next-line
  public async updateUserAnswers(
    question: IQuestionWithAnswers,
    index: number,
    newAnswer: string,
    progressCallback: ProgressCallback,
  ): Promise<number> {
    const snapshot = await gcFirebase.database
      .collection(
        // tslint:disable-next-line
        `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${question.id}`,
      )
      .where('answer', '==', question.answers[index])
      .get();

    const batch = new GCBatchWrapper(gcFirebase.firebaseApp.firestore());

    const total = snapshot.size;
    let current = 0;
    progressCallback({
      current,
      total,
    });

    for (const doc of snapshot.docs) {
      await batch.update(doc.ref, { answer: newAnswer });
      current++;
      progressCallback({
        current,
        total,
      });
    }

    await batch.commit();

    progressCallback({
      current: total,
      total,
    });
    return total;
  }

  public uploadFile(name: string, file: File): Promise<IFileData> {
    return gcFirebase.storage.put(`images/${name}`, file);
  }

  public async getQuestionAnswers(
    questionId: string,
    limit: number = 100,
  ): Promise<IQuestionAnswer[]> {
    let q: firebase.firestore.Query = gcFirebase.database.collection(
      // tslint:disable-next-line
      `statistics/games/${GAME_ID}/${this._state.sessionId}/questions/answers/${questionId}`,
    );

    if (limit) {
      q = q.limit(limit);
    }

    const snapshot = await q.get();

    return snapshot.docs.map((doc) => {
      const result: IQuestionAnswer = doc.data() as IQuestionAnswer;
      result.uid = doc.id;
      return result;
    });
  }

  public async getSetLeaders(
    sessionId?: string,
    setName?: string,
    limit: number = 5,
  ): Promise<IPointsEntry[]> {
    if (isEmptyString(sessionId)) {
      const state = await this.getLatestGame();
      sessionId = state?.sessionId;

      if (isEmptyString(sessionId)) {
        return [];
      }
    }

    if (isEmptyString(setName)) {
      const state = await this.getLatestGame();
      setName = state?.latestSetName;

      if (isEmptyString(setName)) {
        return [];
      }
    }

    return this.getLeaders(`${sessionId}-${setName}`, limit);
  }

  public async getEventLeaders(
    sessionId?: string,
    limit: number = 5,
  ): Promise<IPointsEntry[]> {
    if (isEmptyString(sessionId)) {
      const state = await this.getLatestGame();
      sessionId = state?.sessionId;

      if (isEmptyString(sessionId)) {
        return [];
      }
    }

    return this.getLeaders(sessionId, limit);
  }

  public async getOverallLeaders(limit: number = 5): Promise<IPointsEntry[]> {
    return this.getLeaders('overall', limit);
  }

  private async getLeaders(
    leaderboard: string,
    limit?: number,
  ): Promise<IPointsEntry[]> {
    if (this._isPrizeHoldersResetRunning) {
      return [];
    }

    const innerLimit = limit > 100 ? limit : limit * 5;
    const result: IPointsEntry[] = (await gcFirebase.leaderboards.getLeaders(
      leaderboard,
      innerLimit,
    )) as IPointsEntry[];
    return result
      .filter((item) => !Profanity.isProfane(item.username))
      .slice(0, limit);
  }

  public getOnlineUsers(): Promise<string[]> {
    return gcFirebase.analytics.getOnlineUsers();
  }

  public async getCoupons(): Promise<IGCCoupon[]> {
    const snapshot = await gcFirebase.database
      .collection('coupons')
      .where('gid', '==', GAME_ID as string)
      .get();

    return snapshot.docs.map((doc) => {
      const result: IGCCoupon = doc.data() as IGCCoupon;
      result.id = doc.id;
      result.start = fixDate(result.start);
      result.end = fixDate(result.end);
      return result;
    });
  }

  public async awardCoupon(
    coupon: IGCCoupon,
    users: IPointsEntry[],
    leaderboard: string,
  ): Promise<IGCAwardedCoupon[]> {
    gcFirebase.analytics.award({
      sessionId: this._state.sessionId,
    });
    const result: IGCAwardedCoupon[] = [];
    const collection = gcFirebase.database.collection('awarded-coupons');
    const batch = new GCBatchWrapper(gcFirebase.firebaseApp.firestore());
    this._paginatedLeaders = [];

    for (const user of users) {
      const awardedCoupon: IGCAwardedCoupon = {
        id: uuid(),
        uid: user.uid,
        coupon,
        leaderboard,
        gid: GAME_ID,
        time: firebase.firestore.FieldValue.serverTimestamp() as any,
        awardedTime: firebase.firestore.FieldValue.serverTimestamp() as any,
        delivered: false,
      } as any;

      if (!isEmptyString(user.username)) {
        awardedCoupon.username = user.username;
      }

      if (!isEmptyString(user.email)) {
        awardedCoupon.email = user.email;
      }

      if (!isEmptyString(user.phone)) {
        awardedCoupon.phone = user.phone;
      }

      await batch.set(collection.doc(awardedCoupon.id), awardedCoupon);
      await batch.update(
        gcFirebase.database.doc(
          `statistics/games/${GAME_ID}/leaderboards/${leaderboard}/${user.uid}`,
        ),
        {
          couponStatus: CouponStatus.SENT,
        },
      );
    }

    await batch.commit();
    gcFirebase.analytics.awardResult({
      sessionId: this._state.sessionId,
    });
    return result;
  }

  public async getPaginatedLeaders(
    request: IPaginatedLeadersRequest,
  ): Promise<IPaginatedLeadersResponse> {
    const MAX = 10000;

    if (this._paginatedLeaders.length === 0 || request.current === 0) {
      const includeZero = this._config?.features[Feature.allLeaderboardEntries];
      this._paginatedLeaders = (await gcFirebase.leaderboards.getLeaders(
        request.leaderboard,
        MAX,
        includeZero,
      )) as IPointsEntry[];
      if (request.ageFilter) {
        this._paginatedLeaders = this._paginatedLeaders.filter(
          (entry) => entry.isFiltered === undefined || !entry.isFiltered,
        );
      }
      this._paginatedLeaders.forEach((entry) => {
        if (entry.phone && entry.phone.toString().length === 10) {
          entry.phone = `1${entry.phone}`;
        }
      });
    }

    return {
      total: this._paginatedLeaders.length,
      current: request.current,
      pageSize: request.pageSize,
      leaders: this._paginatedLeaders.slice(
        request.current,
        request.current + request.pageSize,
      ),
    };
  }

  public async getAllPaginatedLeaders(): Promise<IPointsEntry[]> {
    return this._paginatedLeaders || [];
  }

  public async getQuestionAnswerCount(questionId: string): Promise<number> {
    return new Promise((res, rej) => {
      this._answerCountRequests.push({
        sessionId: this._state.sessionId,
        questionId,
        resolution: res,
        rejection: rej,
      });

      if (!this._answerCountTimeout) {
        console.info(
          '%c [ANSWER COUNT POLL] No pending answer requests. Starting...',
          'color: green;',
        );
        this._answerCountTimeout = setTimeout(
          this.handleAnswerCountRequest.bind(this),
          2000,
        );
      }
    });
  }

  private async handleAnswerCountRequest(): Promise<void> {
    // Only continue the poll if we have things to poll
    if (this._answerCountRequests.length) {
      // Get a request
      const request = this._answerCountRequests.shift();
      console.info(
        '%c [ANSWER COUNT POLL] Processing answer count for',
        'color: green;',
        request.questionId,
      );

      // Retrieve request data
      const snapshot = (await gcFirebase.database
        .collection(
          `statistics/games/${GAME_ID}/${request.sessionId}/questions/answers/${request.questionId}`,
        )
        .get()
        .catch(request.rejection)) as firebase.firestore.QuerySnapshot;
      console.info(
        '%c [ANSWER COUNT POLL] Request processed. Got',
        'color: green;',
        snapshot.size,
      );

      // Notify the requester
      request.resolution(snapshot.size);

      // Reschedule poller
      this._answerCountTimeout = setTimeout(
        this.handleAnswerCountRequest.bind(this),
        2000,
      );
    } else {
      console.info(
        '%c [ANSWER COUNT POLL] No answer count requests to handle. Suspending...',
        'color: green;',
      );
      this._answerCountTimeout = null;
    }
  }

  public async getRegisteredUsers(): Promise<IUser[]> {
    const snaphsot = await gcFirebase.database
      .collection('users')
      .where('bucks', '>=', 0)
      .get();

    return snaphsot.docs.map((doc) => doc.data() as IUser);
  }

  public async getLatestGame(): Promise<IGameState> {
    if (this._state.sessionId) {
      return this._state;
    }

    if (this._cachedLatestState) {
      return this._cachedLatestState;
    }

    const snapshot = await gcFirebase.games
      .stateCollection()
      .doc('latest')
      .get();

    if (!snapshot.exists) {
      return null;
    }

    return (this._cachedLatestState = snapshot.data());
  }

  private addPoints(
    uid: string,
    value: number,
    questionSetName: string,
    batch: firebase.firestore.WriteBatch,
  ) {
    // XEO Leaderboard integration
    if (this._backend) {
      const leaderboards = ['overall'];
      if (this._xeoLeaderboard) {
        leaderboards.push(this._xeoLeaderboard);
      }
      this._backend.leaderboards.add(value, leaderboards, uid);
    }
    batch.update(gcFirebase.database.doc(`users/${uid}`), {
      bucks: firebase.firestore.FieldValue.increment(value),
    });

    batch.update(
      gcFirebase.database.doc(
        `statistics/games/${GAME_ID}/leaderboards/overall/${uid}`,
      ),
      {
        points: firebase.firestore.FieldValue.increment(value),
      },
    );

    batch.update(
      gcFirebase.database.doc(
        `statistics/games/${GAME_ID}/leaderboards/${this._state.sessionId}/${uid}`,
      ),
      {
        points: firebase.firestore.FieldValue.increment(value),
      },
    );

    batch.update(
      gcFirebase.database
        // tslint:disable-next-line
        .doc(
          `statistics/games/${GAME_ID}/leaderboards/${this._state.sessionId}-${questionSetName}/${uid}`,
        ),
      {
        points: firebase.firestore.FieldValue.increment(value),
      },
    );
  }

  private async fallbackAddPoints(
    uid: string,
    value: number,
    questionSetName: string,
  ): Promise<any> {
    const promises = [];

    const user: IUser = await gcFirebase.database
      .doc(`users/${uid}`)
      .get()
      .then((doc) => {
        promises.push(
          doc.ref.update({
            bucks: firebase.firestore.FieldValue.increment(value),
          }),
        );
        return doc.data() as IUser;
      });

    promises.push(
      gcFirebase.database
        .doc(`statistics/games/${GAME_ID}/leaderboards/overall/${uid}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            promises.push(
              doc.ref.update({
                points: firebase.firestore.FieldValue.increment(value),
              }),
            );
          } else {
            promises.push(
              doc.ref.set({
                username: user.username,
                uid: user.uid,
                phone: user.phone,
                email: user.email,
                points: value,
              }),
            );
          }
        }),
    );

    promises.push(
      gcFirebase.database
        .doc(
          `statistics/games/${GAME_ID}/leaderboards/${this._state.sessionId}/${uid}`,
        )
        .get()
        .then((doc) => {
          if (doc.exists) {
            promises.push(
              doc.ref.update({
                points: firebase.firestore.FieldValue.increment(value),
              }),
            );
          } else {
            promises.push(
              doc.ref.set({
                username: user.username,
                uid: user.uid,
                phone: user.phone,
                email: user.email,
                points: value,
              }),
            );
          }
        }),
    );

    promises.push(
      gcFirebase.database
        .doc(
          `statistics/games/${GAME_ID}/leaderboards/${this._state.sessionId}-${questionSetName}/${uid}`,
        )
        .get()
        .then((doc) => {
          if (doc.exists) {
            promises.push(
              doc.ref.update({
                points: firebase.firestore.FieldValue.increment(value),
              }),
            );
          } else {
            promises.push(
              doc.ref.set({
                username: user.username,
                uid: user.uid,
                phone: user.phone,
                email: user.email,
                points: value,
              }),
            );
          }
        }),
    );

    return Promise.all(promises);
  }
}

function fixQuestions(value: IEvent): void {
  value.data.forEach((questionSet) => {
    questionSet.questions.forEach((question) => {
      if (!question.id) {
        question.id = uuid();
      }

      delete question.awarded;
      delete question['correctAnswer'];
      delete question['winner'];
      delete question.locked;
      delete question.countdown;
      delete question.pushed;
      delete question.startTime;

      if (question.type === QuestionType.BET_OVER_UNDER) {
        delete (question as IBetOverUnderQuestion).teamA.outcomes[0].under;
        delete (question as IBetOverUnderQuestion).teamB.outcomes[0].over;
      }
    });

    delete questionSet.started;
    delete questionSet.startedTime;
  });
}

function fixEvent(event: IEvent) {
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
}

function snapshotToPlayerAnswers(
  snapshot: firebase.firestore.QuerySnapshot,
): IQuestionAnswer[] {
  return snapshot.docs.map((doc) => {
    const result: IQuestionAnswer = doc.data() as IQuestionAnswer;
    result.uid = doc.id;
    return result;
  });
}

expose(WorkerAPIService);
