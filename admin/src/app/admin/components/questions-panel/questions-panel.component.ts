import m, {ClassComponent, Vnode} from 'mithril';
import {template} from './questions-panel.template';
import './questions-panel.component.scss';
import Stream from 'mithril/stream';
import {
    IGameState,
    IQuestion,
    IEvent,
    IQuestionSet, IOpenResponseQuestion, QuestionType, IBannerQuestion, getQuestionSetByQuestion,
} from '../../../../../../common';
import {api} from '../../services/api';
import {MiniSignalBinding} from 'mini-signals';
import {QuestionPopupFactory} from '../../utils/QuestionPopupFactory';
import {PopupManager} from '../../utils/PopupManager';
import {AlertPopupComponent} from '../alert-popup/alert-popup.component';
import {fileService} from '../../services/FileService';
import {QuestionPanelTab} from './questions-list-header/questions-list-header.component';
import {cloneObject} from '@gamechangerinteractive/gc-firebase/utils';

interface IQuestionsPanelAttrs {
    onEventChange: (value: IEvent) => void;
}

export class QuestionsPanelComponent implements ClassComponent<IQuestionsPanelAttrs> {
    private _event: IEvent;
    private _questionSet: IQuestionSet;
    private _questionSets: Stream.Stream<IQuestionSet[]> = Stream([]);
    private _selectedTab = QuestionPanelTab.DEFAULT;
    private _onEventChange: (value: IEvent) => void;
    private _subscription: MiniSignalBinding;
    private _isStarted: boolean;

    public oninit(vnode: Vnode<IQuestionsPanelAttrs, this>) {
        this._onEventChange = vnode.attrs.onEventChange;
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        this._isStarted = !!value.sessionId;

        if (!this._isStarted) {
            return;
        }

        this._event = value.event;
        this._questionSets(value.event.data);
        this.tabChangeHandler(this._selectedTab);
    }

    public eventChangeHandler(event: IEvent, questionSet: IQuestionSet): void {
        if (this._isStarted) {
            return;
        }

        this._event = event;
        this._questionSets(event.data);

        if (!questionSet) {
            return;
        }

        this._questionSet = questionSet;

        if (this._onEventChange) {
            this._onEventChange(event);
            m.redraw();
        }
    }

    public tabChangeHandler(tab: QuestionPanelTab): void {
        this._selectedTab = tab;
        m.redraw();
    }

    public async questionEditHandler(question: IQuestion, isAward: boolean): Promise<void> {
        const popupComponent = QuestionPopupFactory.get(question.type, isAward && this._isStarted);

        if (!popupComponent) {
            return;
        }

        const result: IQuestion = await PopupManager.show(popupComponent, {
            question: cloneObject(question),
        });

        if (!result) {
            m.redraw();
            return;
        }

        const questionSet = getQuestionSetByQuestion(this._event, result);

        if (questionSet) {
            const index = questionSet.questions.findIndex(item => item.id === result.id);
            questionSet.questions[index] = result;
        }

        await api.saveEvent(this._event);
        this.tabChangeHandler(this._selectedTab);
    }

    public async questionRemoveHandler(question: IQuestion): Promise<void> {
        const result = await PopupManager.show(AlertPopupComponent, {
            title: 'WARNING',
            text: 'Are you sure you want to remove the question?',
        });

        if (!result) {
            return;
        }

        const questionSet = this._event.data.find(questionSet => questionSet.questions.includes(question));
        questionSet.questions.splice(questionSet.questions.indexOf(question), 1);
        api.saveEvent(this._event);
        this.tabChangeHandler(this._selectedTab);

        // Make sure stray images are deleted
        if (question.type === QuestionType.BANNER_IMAGE) {
            fileService.removeFile((question as IBannerQuestion).banner);
        }
    }

    public saveEventHandler() {
        api.saveEvent(this._event);
    }

    public makeLiveHandler(question: IOpenResponseQuestion) {
        api.makeLive(question);
    }

    public moveQuestionUpHandler(question: IQuestion) {
        const questionSet = this._event.data.find(questionSet => questionSet.questions.includes(question));
        const index = questionSet.questions.indexOf(question);

        if (index === 0) {
            return;
        }

        [questionSet.questions[index], questionSet.questions[index - 1]] =
            [questionSet.questions[index - 1], questionSet.questions[index]];
        api.saveEvent(this._event);
    }

    public moveQuestionDownHandler(question: IQuestion) {
        const questionSet = this._event.data.find(questionSet => questionSet.questions.includes(question));
        const index = questionSet.questions.indexOf(question);

        if (index === questionSet.questions.length - 1) {
            return;
        }

        [questionSet.questions[index], questionSet.questions[index + 1]] =
            [questionSet.questions[index + 1], questionSet.questions[index]];
        api.saveEvent(this._event);
    }

    public moveSetUpHandler(questionSet: IQuestionSet) {
        const index = this._event.data.findIndex(item => item.name === questionSet.name);

        if (index <= 0) {
            return;
        }

        [this._event.data[index], this._event.data[index - 1]] =
            [this._event.data[index - 1], this._event.data[index]];
        api.saveEvent(this._event);
    }

    public moveSetDownHandler(questionSet: IQuestionSet) {
        const index = this._event.data.findIndex(item => item.name === questionSet.name);

        if (index === this._event.data.length - 1 || index === -1) {
            return;
        }

        [this._event.data[index], this._event.data[index + 1]] =
            [this._event.data[index + 1], this._event.data[index]];
        api.saveEvent(this._event);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get questionSets(): Stream.Stream<IQuestionSet[]> {
        return this._questionSets;
    }

    public get selectedTab() {
        return this._selectedTab;
    }
}
