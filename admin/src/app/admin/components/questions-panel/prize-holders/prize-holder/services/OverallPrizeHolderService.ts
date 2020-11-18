import {api} from '../../../../../services/api';
import {PrizeHolderService} from './PrizeHolderService';

export class OverallPrizeHolderService extends PrizeHolderService {
    protected async init() {
        this.leadersHandler(await api.getOverallLeaders(1));
    }
}
