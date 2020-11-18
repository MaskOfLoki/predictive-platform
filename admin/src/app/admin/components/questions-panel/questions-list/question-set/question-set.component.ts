import {ClassComponent, Vnode} from 'mithril';
import {template} from './question-set.template';
import './question-set.component.scss';
import {IGameState, IQuestionSet, IQuestion, ScheduleType} from '../../../../../../../../common';
import MiniSignal, {MiniSignalBinding} from 'mini-signals';
import {api} from '../../../../services/api';
import m from 'mithril';
import {PopupManager} from '../../../../utils/PopupManager';
import {AlertPopupComponent} from '../../../alert-popup/alert-popup.component';
import { BehaviorMiniSignal } from '../../../../../utils/BehaviorMiniSignal';

interface IQuestionSetAttrs {
    questionSet: IQuestionSet;
    ondelete: (question: IQuestion) => void;
    onedit: (question: IQuestion, isAward: boolean) => void;
    onmakelive: (question: IQuestion) => void;
    onmoveup: (question: IQuestion) => void;
    onmovedown: (question: IQuestion) => void;
    onsetmoveup: (question: IQuestionSet) => void;
    onsetmovedown: (question: IQuestionSet) => void;
    onsaveevent: () => void;
    isLive: boolean;
}

export class QuestionSetComponent implements ClassComponent<IQuestionSetAttrs> {
    private _currentTimer = 0;

    private _questionSet: IQuestionSet;
    private _isStarted: boolean;
    private _answerCountSignal: MiniSignal = new MiniSignal();
    private _subscription: MiniSignalBinding;
    private _ondelete: (question: IQuestion) => void;
    private _onedit: (question: IQuestion, isAward: boolean) => void;
    private _onmakelive: (question: IQuestion) => void;
    private _onmoveup: (question: IQuestion) => void;
    private _onmovedown: (question: IQuestion) => void;
    private _onsetmoveup: (question: IQuestionSet) => void;
    private _onsetmovedown: (question: IQuestionSet) => void;
    private _onsaveevent: () => void;
    private _timer: number;
    private _isLive: boolean;

    public isOpen = true;

    public oninit(vnode: Vnode<IQuestionSetAttrs, this>) {
        this._subscription = api.state.add(this.stateHandler.bind(this));
        this._ondelete = vnode.attrs.ondelete;
        this._onedit = vnode.attrs.onedit;
        this._onmoveup = vnode.attrs.onmoveup;
        this._onmovedown = vnode.attrs.onmovedown;
        this._onmakelive = vnode.attrs.onmakelive;
        this._onsetmovedown = vnode.attrs.onsetmovedown;
        this._onsetmoveup = vnode.attrs.onsetmoveup;
        this._onsaveevent = vnode.attrs.onsaveevent;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionSetAttrs, this>) {
        this._questionSet = vnode.attrs.questionSet;
        this._isLive = vnode.attrs.isLive;
    }

    private stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;

        if (this._isStarted && this._questionSet && this._questionSet.started && !this._timer) {
            const startDate = this._questionSet.startedTime;
            const now = new Date();
            const timeSinceStart = Math.floor((now.getTime() - startDate.getTime()) / 1000);

            if (this._questionSet.scheduleType === ScheduleType.COUNTDOWN) {
                this._currentTimer = Math.max(this._questionSet.countdown - timeSinceStart, 0);

                if (this._currentTimer > 0) {
                    this.startTimer();
                }

            } else if (this._questionSet.scheduleType === ScheduleType.MANUAL) {
                this._currentTimer = timeSinceStart;
                this.startTimer();
            }
        }

        if (!this._isStarted) {
            this._currentTimer = 0;
            this.stopTimer();

            delete this._questionSet.started;
            delete this._questionSet.startedTime;
        }

        m.redraw();
    }

    public view() {
        return template(this);
    }

    public buttonEditHandler(question: IQuestion, isAward: boolean) {
        this._onedit(question, isAward);
    }

    public buttonRemoveHandler(question: IQuestion) {
        this._ondelete(question);
    }

    public async buttonAddMoreTimeHandler() {
        let result: number = await PopupManager.show(AlertPopupComponent, {
            input: 'number',
            title: 'Time in Seconds',
        });

        if (!result) {
            return;
        }

        result = parseInt(result as any, 10);
        this._questionSet.countdown += result;
        this._currentTimer += result;
        this._onsaveevent();
    }

    public buttonGetAnswerCounts(): void {
        this._answerCountSignal.dispatch();
    }

    public buttonToggleStartHandler(): void {
        switch (this._questionSet.scheduleType) {
            case ScheduleType.COUNTDOWN:
                if (!this._questionSet.startedTime) {
                    this._questionSet.startedTime = new Date();
                    this._questionSet.started = true;
                    this._currentTimer = this._questionSet.countdown;
                    api.updateState();
                }
                break;
            case ScheduleType.MANUAL:
                this._questionSet.started = !this._questionSet.started;

                if (!this._questionSet.startedTime) {
                    this._questionSet.startedTime = new Date();
                }

                if (!this._questionSet.started) {
                    this.stopTimer();
                }

                api.updateState();
                break;
            case ScheduleType.RANGE:
                break;
        }
    }

    public onremove() {
        this._subscription.detach();
        this.stopTimer();
    }

    public get questionSet(): IQuestionSet {
        return this._questionSet;
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }

    public get answerCountSignal(): MiniSignal {
        return this._answerCountSignal;
    }

    private updateTimer(): void {
        switch (this._questionSet.scheduleType) {
            case ScheduleType.COUNTDOWN:
                --this._currentTimer;

                if (this.currentTimer < 1) {
                    this.stopTimer();
                }

                m.redraw();
                break;
            case ScheduleType.MANUAL:
                ++this._currentTimer;
                m.redraw();
                break;
            case ScheduleType.RANGE:
                this.stopTimer();
                break;
        }
    }

    private stopTimer(): void {
        clearInterval(this._timer);
        this._timer = null;
    }

    private startTimer(): void {
        this.stopTimer();
        this._timer = window.setInterval(this.updateTimer.bind(this), 1000);
    }

    public get isLive(): boolean {
        return this._isLive;
    }

    public get isActive(): boolean {
        switch (this._questionSet.scheduleType) {
            case ScheduleType.COUNTDOWN:
            case ScheduleType.MANUAL:
                return !!this._timer;
            case ScheduleType.RANGE:
                const now = new Date();
                return this._questionSet.startTime <= now && this._questionSet.endTime >= now;
        }
    }

    public get onmakelive() {
        return this._onmakelive;
    }

    public get onmoveup() {
        return this._onmoveup;
    }

    public get onmovedown() {
        return this._onmovedown;
    }

    public get onsetmoveup() {
        return this._onsetmoveup;
    }

    public get onsetmovedown() {
        return this._onsetmovedown;
    }

    public get onsaveevent() {
        return this._onsaveevent;
    }

    public get currentTimer(): number {
        return this._currentTimer;
    }
}
