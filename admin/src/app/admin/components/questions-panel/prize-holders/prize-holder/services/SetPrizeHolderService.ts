import {EventPrizeHolderService} from './EventPrizeHolderService';
import {api} from '../../../../../services/api';

export class SetPrizeHolderService extends EventPrizeHolderService {
    constructor(sessionId: string, private _name: string) {
        super(sessionId);
    }

    protected async init() {
        this.leadersHandler(await api.getSetLeaders(this._sessionId, this._name, 1));
    }
}
