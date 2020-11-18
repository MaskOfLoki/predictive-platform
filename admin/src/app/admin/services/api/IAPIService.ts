import * as MiniSignal from 'mini-signals';
import {IBaseAPIService} from './IBaseAPIService';

export interface IAPIService extends IBaseAPIService {
    auth: MiniSignal;
    userCount: MiniSignal;
    state: MiniSignal;
    config: MiniSignal;

    getQuestionAnswerCount(questionId: string): Promise<number>;
}
