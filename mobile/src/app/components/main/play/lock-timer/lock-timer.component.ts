import { template } from './lock-timer.template';
import './lock-timer.component.scss';
import { ClassComponent } from 'mithril';
import { api } from '../../../../services/api';
import { MiniSignalBinding } from 'mini-signals';
import { IEvent, IGameState, ScheduleType } from '../../../../../../../common';
import { getActiveLiveQuestions, getActiveQuestionSets } from '../../../../utils';
import m from 'mithril';

export class LockTimerComponent implements ClassComponent {
    private readonly _subscription: MiniSignalBinding;

    private _timerRefresh: number;
    private _countdown = 0;
    private _event: IEvent;

    public render = false;

    public manualOverride = false;

    constructor() {
        this._subscription = api.state.add(value => setTimeout(this.stateHandler.bind(this, value), 50));
    }

    private stateHandler(value: IGameState): void {
        clearTimeout(this._timerRefresh);

        if (!value.sessionId) {
            this._countdown = 0;
            this._event = null;
            this.render = false;
            return;
        }
        this.render = true;

        this.refresh(value.event);
    }

    private refresh(event: IEvent): void {
        this._event = event;
        let questions = getActiveLiveQuestions(event.data);

        this.manualOverride = false;

        getActiveQuestionSets(event.data).forEach(questionSet => {
            if (questionSet.scheduleType === ScheduleType.MANUAL) {
                if (questionSet.started) {
                    this.manualOverride = true;
                }
                return;
            }

            questions = questions.concat(questionSet.questions);
        });

        questions = questions.filter(question =>
            !question.awarded && !question.locked && !question.pushed && !!question.countdown);
        questions.sort((q1, q2) => q1.countdown - q2.countdown);
        const question = questions[0];
        this._countdown = question ? question.countdown : 0;
        m.redraw();
        this._timerRefresh = window.setTimeout(this.refresh.bind(this, event), 0);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
        clearTimeout(this._timerRefresh);
    }

    public get countdown(): number {
        return this._countdown;
    }

    public get progressMessage(): string {
        return (this._event) ? this._event.progressMessage : '';
    }

    public get completeMessage(): string {
        return (this._event) ? this._event.completeMessage : 'ALL QUESTIONS ARE LOCKED!';
    }
}
