import { IGCAwardedCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

import { IPointsEntry, IQuestionAnswer, IUser } from '../../../../../common';

export interface IBaseAPIService {
  isLoggedIn(uid?: string): Promise<IUser>;

  login(phone: string, email: string): Promise<IUser>;

  loginAnonymously(): Promise<IUser>;

  updateUsername(value: string): Promise<boolean>;

  updateUser(value: any): Promise<void>;

  submitAnswer(answer: IQuestionAnswer): Promise<void>;

  getSubmittedAnswer(questionId: string): Promise<IQuestionAnswer>;

  getSetLeaders(): Promise<IPointsEntry[]>;

  getEventLeaders(): Promise<IPointsEntry[]>;

  getOverallLeaders(limit?: number): Promise<IPointsEntry[]>;

  getSetPosition(): Promise<IPointsEntry>;

  getEventPosition(): Promise<IPointsEntry>;

  getOverallPosition(): Promise<IPointsEntry>;

  getQuestionAnswers(questionId: string): Promise<IQuestionAnswer[]>;

  getUserAnswers(): Promise<IQuestionAnswer[]>;

  updateCoupon(coupon: IGCAwardedCoupon, updates: any): Promise<void>;

  getCoupons(): Promise<IGCAwardedCoupon[]>;

  logout(): Promise<void>;
}
