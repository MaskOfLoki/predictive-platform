import { IAPIService } from './IAPIService';
import { IPointsEntry } from '../../../../../../common';
import { FirebaseAPIService } from './firebase/FirebaseAPIService';

export const api: IAPIService = new FirebaseAPIService();

export interface IPaginatedLeadersRequest {
  pageSize: number;
  current: number;
  leaderboard: string;
  ageFilter?: boolean;
}

export interface IPaginatedLeadersResponse {
  total: number;
  pageSize: number;
  current: number;
  leaders: IPointsEntry[];
}
