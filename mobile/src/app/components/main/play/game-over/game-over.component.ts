import {template} from './game-over.template';
import './game-over.component.scss';
import {ClassComponent} from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import m from 'mithril';
import {api} from '../../../../services/api';
import {IPointsEntry, IUser} from '../../../../../../../common';

export class GameOverComponent implements ClassComponent {
    private _leaders: IPointsEntry[] = [];
    private _uid: string;
    private _subscription: MiniSignalBinding;

    constructor() {
        const subscription = api.user.add((user: IUser) => {
            if (user) {
                subscription.detach();
                this.userHandler(user);
            }
        });
    }

    private async userHandler(value: IUser) {
        this._uid = value.uid;
        this._leaders = await api.getOverallLeaders(3);
        m.redraw();

    }

    public view() {
        return template(this);
    }

    public onremove() {
        if (this._subscription) {
            this._subscription.detach();
        }
    }

    public get leaders(): IPointsEntry[] {
        return this._leaders;
    }

    public get uid(): string {
        return this._uid;
    }
}
