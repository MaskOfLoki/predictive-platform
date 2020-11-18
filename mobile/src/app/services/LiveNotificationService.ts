import {api} from './api';
import {getLeftTime, IGameState, IQuestionSet} from '../../../../common';
import {getActiveLiveQuestions} from '../utils';
import {PopupManager} from '../utils/PopupManager';
import {
    LiveQuestionNotificationComponent,
} from '../components/main/play/popups/live-question-notification/live-question-notification.component';

const LIVE_NOTIFICATIONS_ID = 'liveNotifications';

export class LiveNotificationService {
    private _sessionId: string;
    private _notifiedIds: string[] = [];
    private _questionSets: IQuestionSet[] = [];
    private _isNotificationOpen: boolean;

    constructor() {
        const dataStr = localStorage.getItem(LIVE_NOTIFICATIONS_ID);

        if (dataStr) {
            const data = JSON.parse(dataStr);
            this._sessionId = data.sessionId;
            this._notifiedIds = data.notifiedIds;
        }
    }

    public start(): void {
        api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        if (!value.sessionId) {
            this._questionSets = [];
            return;
        }

        if (this._sessionId !== value.sessionId) {
            this._sessionId = value.sessionId;
            this._notifiedIds = [];
            this.save();
        }

        this._questionSets = value.event.data;
        this.refresh();
    }

    private async refresh() {
        if (this._isNotificationOpen) {
            return;
        }

        const questions = getActiveLiveQuestions(this._questionSets)
            .filter(question =>
                !this._notifiedIds.includes(question.id) && !question.awarded && getLeftTime(question) > 0,
            );

        if (questions.length === 0) {
            return;
        }

        this._isNotificationOpen = true;
        const question = questions[0];

        this._notifiedIds.push(question.id);
        this.save();

        await PopupManager.show(LiveQuestionNotificationComponent, {
            question,
        });

        this._isNotificationOpen = false;
        this.refresh();
    }

    private save(): void {
        localStorage.setItem(LIVE_NOTIFICATIONS_ID, JSON.stringify({
            sessionId: this._sessionId,
            notifiedIds: this._notifiedIds,
        }));
    }
}
