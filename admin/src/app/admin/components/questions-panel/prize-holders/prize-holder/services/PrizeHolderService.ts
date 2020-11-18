import {BehaviorMiniSignal} from '../../../../../../utils/BehaviorMiniSignal';
import MiniSignal from 'mini-signals';
import {IPointsEntry} from '../../../../../../../../../common';
import m from 'mithril';
import {api} from '../../../../../services/api';

export abstract class PrizeHolderService {
    public readonly prizeHolder: MiniSignal = new BehaviorMiniSignal();

    constructor() {
        const subscription = api.auth.add(value => {
            if (!value) {
                return;
            }

            subscription.detach();
            requestAnimationFrame(this.init.bind(this));
        });
    }

    protected abstract async init();

    protected leadersHandler(leaders: IPointsEntry[]) {
        if (leaders.length > 0) {
            this.prizeHolder.dispatch(leaders[0]);
        } else {
            this.prizeHolder.dispatch();
        }

        m.redraw();
    }
}
