import m, { ClassComponent, Vnode } from 'mithril';
import { IQuestionSet, ScheduleType } from '../../../../../../../../common';
import { template } from './question-set.template';
import './question-set.component.scss';

interface IQuestionSetAttrs {
    questionSet: IQuestionSet;
    isHide: boolean;
}

export class QuestionSetComponent implements ClassComponent<IQuestionSetAttrs> {
    private _questionSet: IQuestionSet;
    private _locked: boolean = false;
    private _timer: number;

    public isHide: boolean = false;
    public isOpen: boolean = true;

    public oninit(vnode: Vnode<IQuestionSetAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionSetAttrs, this>) {
        if (vnode.attrs.isHide) {
            this.isHide = true;
        }

        if (this._questionSet === vnode.attrs.questionSet) {
            return;
        }

        this._questionSet = vnode.attrs.questionSet;

        switch (this._questionSet.scheduleType) {
            case ScheduleType.COUNTDOWN:
                const startDate = this._questionSet.startedTime;
                const now = new Date();
                const timeSinceStart = Math.floor((now.getTime() - startDate.getTime()) / 1000);

                if (timeSinceStart < this._questionSet.countdown) {
                    clearInterval(this._timer);
                    this._timer = window.setInterval(this.checkCountdown.bind(this), 1000);
                    this.checkCountdown();
                } else {
                    this._questionSet.questions.forEach(question => question.locked = true);
                }

                break;
            case ScheduleType.MANUAL:
                this._locked = !this._questionSet.started;

                if (this._locked) {
                    this._questionSet.questions.forEach(question => question.locked = true);
                }

                break;
            case ScheduleType.RANGE:
                clearInterval(this._timer);

                if (new Date() < this._questionSet.endTime) {
                    this._timer = window.setInterval(this.checkRange.bind(this), 1000);
                    this.checkRange();
                } else {
                    this._locked = true;
                    this._questionSet.questions.forEach(question => question.locked = true);
                }

                break;
        }
    }

    public view() {
        return template(this);
    }

    public onremove() {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    private checkCountdown() {
        const startDate = this._questionSet.startedTime;
        const now = new Date();
        const timeSinceStart = Math.floor((now.getTime() - startDate.getTime()) * 0.001);

        if (timeSinceStart > this._questionSet.countdown) {
            this._locked = true;
            this._questionSet.questions.forEach(question => question.locked = true);
            clearInterval(this._timer);
            this._timer = null;
        } else {
            this._questionSet.questions.forEach(question =>
                question.countdown = this._questionSet.countdown - timeSinceStart,
            );
        }

        m.redraw();
    }

    private checkRange() {
        if (new Date() > this._questionSet.endTime) {
            this._locked = true;
            this._questionSet.questions.forEach(question => question.locked = true);
            clearInterval(this._timer);
            this._timer = null;
        } else if (this._questionSet.endTime) {
            this._questionSet.questions.forEach(question =>
                question.countdown = Math.round((this._questionSet.endTime.getTime() - Date.now()) * 0.001),
            );
        }

        m.redraw();
    }

    public get locked(): boolean {
        return this._locked;
    }

    public get questionSet(): IQuestionSet {
        return this._questionSet;
    }

    public get countdown(): number {
        return (this._questionSet && this._questionSet.questions.length > 0) ?
            this._questionSet.questions[0].countdown : 0;
    }
}
