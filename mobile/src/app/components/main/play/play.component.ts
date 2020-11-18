import {template} from './play.template';
import './play.component.scss';
import m from 'mithril';
import {api} from '../../../services/api';
import {IGameState, ScheduleType} from '../../../../../../common';
import {getActiveLiveQuestions, getActiveQuestionSets} from '../../../utils';
import {BaseComponent} from '../../../utils/BaseComponent';

export class PlayComponent extends BaseComponent {
    private _isStarted: boolean;
    private _showLockTimer: boolean;
    private _timer: number;

    constructor() {
        super();
        api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        this.refresh(value);
    }

    private refresh(value: IGameState): void {
        clearTimeout(this._timer);

        if (!value.sessionId) {
            this._isStarted = false;
            this._showLockTimer = false;
            m.redraw();
            return;
        }

        const activeQuestionSets = getActiveQuestionSets(value.event.data);
        this._isStarted = getActiveLiveQuestions(value.event.data).length > 0 ||
            activeQuestionSets.length > 0;
        this._showLockTimer = activeQuestionSets.some((item) => {
            return item.scheduleType !== ScheduleType.MANUAL ||
                (item.started && value.event.progressMessage) || (!item.started && value.event.completeMessage);
        });
        m.redraw();

        this._timer = window.setTimeout(this.refresh.bind(this, value), 10000);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        clearTimeout(this._timer);
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public get showLockTimer(): boolean {
        return this._showLockTimer;
    }
}
