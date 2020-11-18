import {ClassComponent} from 'mithril';
import {template} from './prize-holders.template';
import './prize-holders.component.scss';
import {IGameState} from '../../../../../../../common';
import m from 'mithril';
import {api} from '../../../services/api';

export class PrizeHoldersComponent implements ClassComponent {
    private _game: IGameState;

    constructor() {
        const subscription = api.auth.add(value => {
            if (!value) {
                return;
            }

            subscription.detach();
            this.authHandler();
        });
    }

    private async authHandler() {
        this._game = await api.getLatestGame();
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public get game(): IGameState {
        return this._game;
    }
}

export enum PrizeHolderType {
    OVERALL,
    EVENT,
    SET,
}
