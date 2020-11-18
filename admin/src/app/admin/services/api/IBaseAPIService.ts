import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';
import { IGCCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCCoupon';

import {
  IConfig,
  IEvent,
  IFileData,
  IGameState,
  IOpenResponseQuestion,
  IPointsEntry,
  IQuestion,
  IQuestionAnswer,
  IUser,
} from '../../../../../../common';
import { ProgressCallback } from '../../utils';
import { IPaginatedLeadersRequest, IPaginatedLeadersResponse } from './index';

export interface IBaseAPIService {
  init?(): Promise<boolean>;
  login(clientId: string, secret: string, key?: string): Promise<boolean>;

  getEvents(): Promise<IEvent[]>;

  saveEvent(value: IEvent): Promise<void>;

  addEvent(value: IEvent): Promise<IEvent>;

  deleteEvent(value: IEvent): Promise<void>;

  startEvent(value: IEvent): Promise<void>;

  updateState(value?: IGameState): Promise<void>;

  stopEvent(): Promise<void>;

  revertQuestionAward(
    question: IOpenResponseQuestion,
    progressCallback: ProgressCallback,
  ): Promise<void>;

  awardQuestion(
    question: IQuestion,
    progressCallback: ProgressCallback,
  ): Promise<number>;

  pushQuestion(question: IQuestion): Promise<number>;

  makeLive(question: IOpenResponseQuestion): Promise<void>;

  saveConfig(config: IConfig): Promise<void>;

  getLatestGame(): Promise<IGameState>;

  getUserPhone(uid: string): Promise<string>;

  resetPrizeHolders(leaderboards?: string[]): Promise<void>;

  // tslint:disable-next-line: max-line-length
  updateUserAnswers(
    question: IQuestion,
    index: number,
    newAnswer: string,
    progressCallback: ProgressCallback,
  ): Promise<number>;

  uploadFile(name: string, file: File): Promise<IFileData>;

  removeFile(path: string): Promise<void>;

  getSetLeaders(
    sessionId: string,
    setName: string,
    limit?: number,
  ): Promise<IPointsEntry[]>;

  getEventLeaders(sessionId: string, limit?: number): Promise<IPointsEntry[]>;

  getOverallLeaders(limit?: number): Promise<IPointsEntry[]>;

  getQuestionAnswers(
    questionId: string,
    limit?: number,
  ): Promise<IQuestionAnswer[]>;

  getCoupons(): Promise<IGCCoupon[]>;

  awardCoupon(
    coupon: IGCCoupon,
    users: IPointsEntry[],
    leaderboard: string,
  ): Promise<IGCAwardedCoupon[]>;

  getPaginatedLeaders(
    request: IPaginatedLeadersRequest,
  ): Promise<IPaginatedLeadersResponse>;

  getAllPaginatedLeaders(xeoAgeFilter?: boolean): Promise<IPointsEntry[]>;

  getRegisteredUsers(): Promise<IUser[]>;
}
