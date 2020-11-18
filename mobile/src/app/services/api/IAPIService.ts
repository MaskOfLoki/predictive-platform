import MiniSignal from 'mini-signals';
import {IBaseAPIService} from './IBaseAPIService';

export interface IAPIService extends IBaseAPIService {
    user: MiniSignal;
    state: MiniSignal;
    overallPosition: MiniSignal;
    coupon: MiniSignal;
    config: MiniSignal;
}
