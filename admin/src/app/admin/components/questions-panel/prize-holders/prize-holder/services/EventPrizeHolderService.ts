import {PrizeHolderService} from './PrizeHolderService';
import {api} from '../../../../../services/api';

export class EventPrizeHolderService extends PrizeHolderService {
    constructor(protected _sessionId: string) {
        super();
    }

    protected async init() {
        this.leadersHandler(await api.getEventLeaders(this._sessionId, 1));
    }
}
