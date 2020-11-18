import {template} from './live-questions.template';
import './live-questions.component.scss';
import {ClassComponent} from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import {IGameState, IQuestion} from '../../../../../../../common';
import {api} from '../../../../services/api';
import m from 'mithril';
import {getActiveLiveQuestions} from '../../../../utils';

export class LiveQuestionsComponent implements ClassComponent {
    private _subscription: MiniSignalBinding;
    private _questions: IQuestion[] = [];

    constructor() {
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }

    private stateHandler(value: IGameState): void {
        if (!value.sessionId) {
            this._questions = [];
            m.redraw();
            return;
        }

        this._questions = getActiveLiveQuestions(value.event.data);
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
    }

    public get questions(): IQuestion[] {
        return this._questions;
    }
}
