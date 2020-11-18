import {IBaseAPIService} from '../IBaseAPIService';
import {IConfig, IGameState, IUser} from '../../../../../../common';
import {IGCAwardedCoupon} from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

export interface IWorkerService extends IBaseAPIService {
    init(clientId: string): Promise<void>;
    initCallbacks(userCallback: (value: IUser) => void,
                  stateCallback: (value: IGameState) => void,
                  couponCallback: (value: IGCAwardedCoupon) => void,
                  configCallback: (value: IConfig) => void);
}
