import {redraw, ClassComponent, Vnode} from 'mithril';
import {template} from './prize-holder.template';
import './prize-holder.component.scss';
import {PrizeHolderType} from '../prize-holders.component';
import {PrizeHolderService} from './services/PrizeHolderService';
import {PrizeHolderServiceFactory} from './services/PrizeHolderServiceFactory';
import {IPointsEntry} from '../../../../../../../../common';
import {MiniSignalBinding} from 'mini-signals';
import {PopupManager} from '../../../../utils/PopupManager';
import {CouponsComponent} from './coupons/coupons.component';
import {Process, processes} from '../../../../services/ProcessesService';
import Swal from 'sweetalert2';
import {loading} from '../../../../services/LoadingService';
import {api} from '../../../../services/api';
import {progressService} from '../../../../services/ProgressService';

interface IPrizeHolderAttrs {
    type: PrizeHolderType;
    name: string;
    sessionId: string;
}

export class PrizeHolderComponent implements ClassComponent<IPrizeHolderAttrs> {
    private _type: PrizeHolderType;
    private _name: string;
    private _sessionId: string;
    private _service: PrizeHolderService;
    private _prizeHolder: IPointsEntry;
    private _subscription: MiniSignalBinding;

    public oninit(vnode: Vnode<IPrizeHolderAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IPrizeHolderAttrs, this>) {
        if (this._type === vnode.attrs.type &&
            this._name === vnode.attrs.name &&
            this._sessionId === vnode.attrs.sessionId) {
            return;
        }

        if (this._subscription) {
            this._subscription.detach();
        }

        this._type = vnode.attrs.type;
        this._name = vnode.attrs.name;
        this._sessionId = vnode.attrs.sessionId;

        this.onremove();

        this._service = PrizeHolderServiceFactory.get(this._type, this._sessionId, this._name);
        this._subscription = this._service.prizeHolder.add(this.prizeHolderHandler.bind(this));
    }

    private prizeHolderHandler(value: IPointsEntry) {
        this._prizeHolder = value;
        redraw();
    }

    public clickHandler() {
        if (processes.isRunning(Process.AWARD)) {
            Swal.fire({
                icon: 'warning',
                title: 'Please, wait for awarding to complete',
            });
            return;
        }

        PopupManager.show(CouponsComponent, {
            type: this._type,
            sessionId: this._sessionId,
            name: this._name,
        });
    }

    public buttonRemoveHandler(e: Event) {
        e.stopImmediatePropagation();
        let leaderboard: string;

        switch (this._type) {
            case PrizeHolderType.OVERALL: {
                leaderboard = 'overall';
                break;
            }
            case PrizeHolderType.EVENT: {
                leaderboard = this._sessionId;
                break;
            }
            case PrizeHolderType.SET: {
                leaderboard = `${this._sessionId}-${this._name}`;
                break;
            }
        }

        const progressCallback = progressService.start('Clearing...');
        const completeHandler = () => progressCallback({
            current: 1,
            total: 1,
        });
        loading.wrap(api.resetPrizeHolders([leaderboard]))
            .then(completeHandler, completeHandler);
        this._prizeHolder = undefined;
        redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        if (this._subscription) {
            this._subscription.detach();
        }
    }

    public get type(): PrizeHolderType {
        return this._type;
    }

    public get name(): string {
        return this._name;
    }

    public get prizeHolder(): IPointsEntry {
        return this._prizeHolder;
    }
}
