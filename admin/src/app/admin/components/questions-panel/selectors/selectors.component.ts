import m, {ClassComponent, Vnode} from 'mithril';
import {template} from './selectors.template';
import './selectors.component.scss';
import {
    IGameState,
    IQuestion,
    IEvent,
    isEmptyString,
    QuestionType,
    EventType,
    IQuestionSet,
} from '../../../../../../../common';
import {api} from '../../../services/api';
import {PopupManager} from '../../../utils/PopupManager';
import {AlertPopupComponent} from '../../alert-popup/alert-popup.component';
import {QuestionPopupFactory} from '../../../utils/QuestionPopupFactory';
import {NewEventPopupComponent} from '../../new-event-popup/new-event-popup.component';
import {NewSetPopupComponent} from '../../new-set-popup/new-set-popup.component';
import {cloneObject} from '@gamechangerinteractive/gc-firebase/utils';

interface ISelectorsAttrs {
    onchange: (value: IEvent) => void;
}

const EVENT_ID_KEY = 'gc.selectedEvent';

export class SelectorsComponent implements ClassComponent<ISelectorsAttrs> {
    private _events: IEvent[] = [];
    private _selectedEvent: IEvent;
    private _selectedQuestionSet: IQuestionSet;
    private _onchange: (event: IEvent, questionSet: IQuestionSet) => void;
    private _isStarted: boolean;

    private _questionTypes = [
        {
            type: QuestionType.BET_MONEYLINE,
            label: 'BET - Moneyline',
            eventType: EventType.BETTING,
        },
        {
            type: QuestionType.BET_POINT_SPREAD,
            label: 'BET - Point Spread',
            eventType: EventType.BETTING,
        },
        {
            type: QuestionType.BET_OVER_UNDER,
            label: 'BET - Over-Under',
            eventType: EventType.BETTING,
        },
        {
            type: QuestionType.BET_PROP,
            label: 'BET - Prop Bet',
            eventType: EventType.BETTING,
        },
        {
            type: QuestionType.QUESTION_MULTIPLE_CHOICE,
            label: 'QUESTION - Multiple Choice',
            eventType: EventType.PREDICTIVE,
        },
        {
            type: QuestionType.QUESTION_OPEN_RESPONSE,
            label: 'QUESTION - Open Response',
            eventType: EventType.PREDICTIVE,
        },
        {
            type: QuestionType.POLL_MULTIPLE_CHOICE,
            label: 'POLL - Multiple Choice',
            eventType: EventType.ANY,
        },
        {
            type: QuestionType.POLL_OPEN_RESPONSE,
            label: 'POLL - Open Response',
            eventType: EventType.ANY,
        },
        {
            type: QuestionType.BANNER_IMAGE,
            label: 'BANNER - Image',
            eventType: EventType.ANY,
        },
    ];

    constructor() {
        const binding = api.auth.add(value => {
            if (value) {
                binding.detach();
                this.authHandler();
            }
        });
    }

    public oninit(vnode: Vnode<ISelectorsAttrs, this>) {
        this._onchange = vnode.attrs.onchange;
    }

    private async authHandler() {
        api.state.add(this.stateHandler.bind(this));
        m.redraw();
    }

    private async stateHandler(value: IGameState) {
        this._isStarted = !!value.sessionId;

        if (this._isStarted) {
            this._selectedEvent = value.event;
            return;
        }

        this._events = await api.getEvents();

        if (this._events.length > 0) {
            const selectedQuestionSetId = localStorage.getItem(EVENT_ID_KEY);

            if (selectedQuestionSetId) {
                this._selectedEvent = this._events.find(item => item.id === selectedQuestionSetId);
            }

            if (!this._selectedEvent) {
                this._selectedEvent = this._events[0];
            }

            if (this._selectedEvent) {
                this._selectedQuestionSet = this._selectedEvent.data[0];
            }

            this.dispatchEvent();
        }
    }

    public async selectEventHandler(e: Event) {
        const selectElement = e.target as HTMLSelectElement;
        const value = selectElement.value;

        if (!isEmptyString(value)) {
            this._selectedEvent = this._events.find(item => item.id === value);

            if (this._selectedEvent) {
                this._selectedQuestionSet = this._selectedEvent.data[0];
            }

            this.dispatchEvent();
        }

        m.redraw();
    }

    public async buttonAddEventHandler(): Promise<void> {
        const result: IEvent = await PopupManager.show(NewEventPopupComponent);

        if (result) {
            this._selectedEvent = await api.addEvent(result);
            this._events.push(this._selectedEvent);
            this.dispatchEvent();
            m.redraw();
        }
    }

    public async buttonEditEventHandler(): Promise<void> {
        const result: IEvent = await PopupManager.show(NewEventPopupComponent, {
            event: cloneObject(this._selectedEvent),
        });

        if (result) {
            api.deleteEvent(this._selectedEvent);
            localStorage.setItem(EVENT_ID_KEY, result.id);
            await api.saveEvent(result);
            const idx = this._events.findIndex(event => event.id === this._selectedEvent.id);
            this._selectedEvent = this._events[idx] = result;
            m.redraw();
        }
    }

    public async buttonDeleteEventHandler(): Promise<void> {
        const result = await PopupManager.show(AlertPopupComponent, {
            title: `DELETE ${this._selectedEvent.id}`,
            text: 'Are you sure you want to delete the current event?',
        });

        if (result) {
            await api.deleteEvent(this._selectedEvent);
            this._events = await api.getEvents();
            this._selectedEvent = this._events[0];
            localStorage.removeItem(EVENT_ID_KEY);
            m.redraw();
        }
    }

    public async selectQuestionSetHandler(e: Event) {
        const selectElement = e.target as HTMLSelectElement;
        const value = selectElement.value;
        this._selectedQuestionSet = this._selectedEvent.data.find(questionSet => questionSet.name === value);
        this.dispatchEvent();
    }

    public async selectQuestionTypeHandler(e: Event) {
        const selectElement = e.target as HTMLSelectElement;
        const value = selectElement.value;
        selectElement.value = '';

        const questionType: QuestionType = value as QuestionType;
        const questionPopupComponent = QuestionPopupFactory.get(questionType);

        if (!questionPopupComponent) {
            return;
        }

        const question: IQuestion = await PopupManager.show(questionPopupComponent);

        if (!question) {
            return;
        }

        this._selectedQuestionSet.questions.push(question);
        await api.saveEvent(this._selectedEvent);

        this.dispatchEvent();

        m.redraw();
    }

    public async buttonAddSetHandler() {
        const result: IQuestionSet = await PopupManager.show(NewSetPopupComponent, {
            existedNames: this._selectedEvent ? this._selectedEvent.data.map(item => item.name) : [],
        });

        if (!result) {
            return;
        }

        this._selectedEvent.data.push(result);
        await api.saveEvent(this._selectedEvent);
        this._selectedQuestionSet = result;
        this.dispatchEvent();
        m.redraw();
    }

    public async buttonEditSetHandler(): Promise<void> {
        const result = await PopupManager.show(NewSetPopupComponent, {
            questionSet: cloneObject(this._selectedQuestionSet),
            existedNames: this._selectedEvent ? this._selectedEvent.data
                .filter(item => item !== this._selectedQuestionSet)
                .map(item => item.name) : [],
        });

        if (result) {
            this._selectedEvent.data[this._selectedEvent.data.indexOf(this._selectedQuestionSet)] = result;
            this._selectedQuestionSet = result;
            api.saveEvent(this._selectedEvent);
            m.redraw();
        }
    }

    public async buttonDeleteSetHandler(): Promise<void> {
        const result = await PopupManager.show(AlertPopupComponent, {
            title: `DELETE ${this._selectedQuestionSet.name}`,
            text: 'Are you sure you want to delete the question set?',
        });

        if (result) {
            this._selectedEvent.data.splice(this._selectedEvent.data.indexOf(this._selectedQuestionSet), 1);
            this._selectedQuestionSet = this._selectedEvent.data[0];
            api.saveEvent(this._selectedEvent);
            m.redraw();
        }
    }

    private dispatchEvent(): void {
        if (this._onchange) {
            this._onchange(this._selectedEvent, this._selectedQuestionSet);
        }

        if (this._selectedEvent) {
            localStorage.setItem('gc.selectedEvent', this._selectedEvent.id);
        } else {
            localStorage.removeItem('gc.selectedEvent');
        }
    }

    public view() {
        return template(this);
    }

    public get selectedEvent(): IEvent {
        return this._selectedEvent;
    }

    public get selectedQuestionSet(): IQuestionSet {
        return this._selectedQuestionSet;
    }

    public get events(): IEvent[] {
        return this._events;
    }

    public get questionTypes() {
        return this._questionTypes.filter(questionType => {
                return !questionType.type || questionType.eventType === EventType.ANY ||
                    questionType.eventType === this._selectedEvent.type;
            },
        );
    }

    public get isStarted(): boolean {
        return this._isStarted;
    }
}
