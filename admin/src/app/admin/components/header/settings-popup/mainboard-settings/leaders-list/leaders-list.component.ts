import {template} from './leaders-list.template';
import './leaders-list.component.scss';
import {IGameState, IPointsEntry, LeaderboardType} from '../../../../../../../../../common';
import m, {ClassComponent, Vnode} from 'mithril';
import {api} from '../../../../../services/api';
// import {mainboardService} from '../../../../../services/MainboardService';
import {MiniSignalBinding} from 'mini-signals';

interface ILeadersListAttrs {
    type: LeaderboardType;
}

export class LeadersListComponent implements ClassComponent<ILeadersListAttrs> {
    private _leaders: IPointsEntry[] = [];
    private _type: LeaderboardType = LeaderboardType.OVERALL;
    private _state: IGameState = {};
    private readonly _subscription: MiniSignalBinding;

    constructor() {
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        this._state = value;
        this.refresh();
    }

    public oninit(vnode: Vnode<ILeadersListAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ILeadersListAttrs, this>) {
        if (this._type === vnode.attrs.type) {
            return;
        }

        this._type = vnode.attrs.type;
        this.refresh();
    }

    private async refresh() {
        switch (this._type) {
            case LeaderboardType.OVERALL:
                this._leaders = await api.getOverallLeaders(5);
                break;
            case LeaderboardType.DAILY:
                this._leaders = await api.getEventLeaders(undefined, 5);
                break;
            case LeaderboardType.SET:
                this._leaders = await api.getSetLeaders(undefined, undefined, 5);
                break;
        }

        m.redraw();
    }

    public buttonShareHandler() {
        // mainboardService.showLeaderboard(this._leaders);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get leaders(): IPointsEntry[] {
        return this._leaders;
    }
}
