import {ClassComponent, Vnode} from 'mithril';
import {template} from './new-set-popup.template';
import './new-set-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {IQuestionSet, isEmptyString, ScheduleType} from '../../../../../../common';
import {PopupManager} from '../../utils/PopupManager';

export interface INewEventAttrs {
    closePopup: MiniSignal;
    existedNames: string[];
    questionSet?: IQuestionSet;
}

export class NewSetPopupComponent implements ClassComponent<INewEventAttrs> {
    private _closePopup: MiniSignal;
    private _existedNames: string[];
    private _questionSet: IQuestionSet = {
        name: '',
        questions: [],
        progressMessage: '',
        completeMessage: '',
        scheduleType: ScheduleType.COUNTDOWN,
        countdown: 30 * 60,
    };

    public oninit(vnode: Vnode<INewEventAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._existedNames = vnode.attrs.existedNames;

        if (vnode.attrs.questionSet) {
            this._questionSet = vnode.attrs.questionSet;
        }
    }

    public rangeChangeHandler(start: Date, end: Date) {
        this.questionSet.startTime = start;
        this.questionSet.endTime = end;
    }

    public buttonCancelHandler(): void {
        this._closePopup.dispatch();
    }

    public buttonConfirmHandler(): void {
        if (isEmptyString(this._questionSet.name)) {
            PopupManager.warning('Please, provide question set name');
            return;
        }

        if (this._existedNames.find(item => item === this._questionSet.name)) {
            PopupManager.warning(
                `Question set "${this._questionSet.name}" already exists. Please, provide another name.`);
            return;
        }

        if (this._questionSet.scheduleType === ScheduleType.COUNTDOWN &&
            (isNaN(this._questionSet.countdown) || this._questionSet.countdown <= 0)) {
            PopupManager.warning('Please, provide valid countdown');
            return;
        }

        if (this._questionSet.scheduleType === ScheduleType.RANGE &&
            this._questionSet.startTime >= this._questionSet.endTime) {
            PopupManager.warning('Start Time should be earlier than End Time');
            return;
        }

        this._closePopup.dispatch(this._questionSet);
    }

    public view() {
        return template(this);
    }

    public get questionSet(): IQuestionSet {
        return this._questionSet;
    }
}
