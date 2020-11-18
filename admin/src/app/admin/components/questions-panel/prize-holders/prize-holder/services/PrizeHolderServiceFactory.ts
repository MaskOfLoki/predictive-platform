import {PrizeHolderType} from '../../prize-holders.component';
import {PrizeHolderService} from './PrizeHolderService';
import {OverallPrizeHolderService} from './OverallPrizeHolderService';
import {SetPrizeHolderService} from './SetPrizeHolderService';
import {EventPrizeHolderService} from './EventPrizeHolderService';

export class PrizeHolderServiceFactory {
    public static get(type: PrizeHolderType, sessionId: string, name: string): PrizeHolderService {
        if (type === PrizeHolderType.OVERALL) {
            return new OverallPrizeHolderService();
        } else if (type === PrizeHolderType.EVENT) {
            return new EventPrizeHolderService(sessionId);
        } else if (type === PrizeHolderType.SET) {
            return new SetPrizeHolderService(sessionId, name);
        }
    }
}
