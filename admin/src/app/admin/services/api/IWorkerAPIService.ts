import { IBaseAPIService } from './IBaseAPIService';

export interface IWorkerAPIService extends IBaseAPIService {
    initCallbacks(authCallback,
                  userCountCallback,
                  stateCallback,
                  configCallback): void;
    getOnlineUsers(): Promise<string[]>;
    getQuestionAnswerCount(questionId: string): Promise<number>;
}
