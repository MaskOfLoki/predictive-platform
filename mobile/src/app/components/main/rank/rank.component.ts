import { template } from './rank.template';
import './rank.component.scss';
import m, { ClassComponent } from 'mithril';
import { IPointsEntry, IUser, LeaderboardType } from '../../../../../../common';
import { api } from '../../../services/api';
import { MiniSignalBinding } from 'mini-signals';
import { configService } from '../../../services/config';

export class RankComponent implements ClassComponent {
    private _leaders: IPointsEntry[] = [];
    private _uid: string;
    private _selectedLeaderboardType: LeaderboardType = LeaderboardType.OVERALL;
    private readonly _subscriptions: MiniSignalBinding[] = [];

    constructor() {
        const subscription = api.user.add((user: IUser) => {
            if (user) {
                subscription.detach();
                this.userHandler(user);
            }
        });
    }

    private userHandler(value: IUser): void {
        this._uid = value.uid;
        this._subscriptions.push(configService.add(this.configChangeHandler.bind(this)));
        this.leaderboardTypeChangeHandler(LeaderboardType.OVERALL);
    }

    private configChangeHandler() {
        if ((this._selectedLeaderboardType === LeaderboardType.SET && configService.disabledSetLeaderboard) ||
            (this._selectedLeaderboardType === LeaderboardType.DAILY && configService.disabledDailyLeaderboard)) {
            this.leaderboardTypeChangeHandler(LeaderboardType.OVERALL);
        }
    }

    public async leaderboardTypeChangeHandler(value: LeaderboardType) {
        this._selectedLeaderboardType = value;
        this._leaders = [];
        m.redraw();

        switch (value) {
            case LeaderboardType.OVERALL: {
                this._leaders = await api.getOverallLeaders(10);
                this._leaders = this._leaders.slice(0, 10);

                if (this._leaders.length > 0 && !this._leaders.find(item => item.uid === this._uid)) {
                    this._leaders.push(await api.getOverallPosition());
                }

                break;
            }
            case LeaderboardType.DAILY: {
                this._leaders = await api.getEventLeaders();
                this._leaders = this._leaders.slice(0, 10);

                if (this._leaders.length > 0 && !this._leaders.find(item => item.uid === this._uid)) {
                    this._leaders.push(await api.getEventPosition());
                }

                break;
            }
            case LeaderboardType.SET: {
                this._leaders = await api.getSetLeaders();
                this._leaders = this._leaders.slice(0, 10);

                if (this._leaders.length > 0 && !this._leaders.find(item => item.uid === this._uid)) {
                    this._leaders.push(await api.getSetPosition());
                }

                break;
            }
        }

        if (this._leaders) {
            this._leaders = this._leaders.filter(item => !!item);
            this._leaders.forEach((item, index) => {
                if (!item.position) {
                    item.position = index + 1;
                }
            });
        }

        m.redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(item => item.detach());
    }

    public get leaders(): IPointsEntry[] {
        return this._leaders;
    }

    public get uid(): string {
        return this._uid;
    }

    public get selectedLeaderboardType(): LeaderboardType {
        return this._selectedLeaderboardType;
    }
}
