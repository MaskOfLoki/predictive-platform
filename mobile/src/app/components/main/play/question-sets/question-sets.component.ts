import m, { ClassComponent, Vnode } from 'mithril';
import { template } from './question-sets.template';
import { MiniSignalBinding } from 'mini-signals';
import { IGameState, IQuestionSet } from '../../../../../../../common';
import { api } from '../../../../services/api';
import { getActiveQuestionSets } from '../../../../utils';

import './question-sets.component.scss';

interface IQuestionSetsAttrs {
    isHide: boolean;
}

export class QuestionSetsComponent implements ClassComponent<IQuestionSetsAttrs> {
    private _questionSets: IQuestionSet[] = [];
    private _subscription: MiniSignalBinding;
    private _timer: number;
    public isHide: boolean = false;

    constructor() {
        this._subscription = api.state.add(this.stateHandler.bind(this));
    }
    public oninit(vnode: Vnode<IQuestionSetsAttrs, this>) {
        this.isHide = vnode.attrs.isHide;
    }
    private stateHandler(value: IGameState): void {
        if (!value.sessionId) {
            this._questionSets = [];
            m.redraw();
            return;
        }

        this.refresh(value.event.data || []);
        m.redraw();
    }

    private refresh(values: IQuestionSet[]): void {
        clearTimeout(this._timer);
        this._questionSets = getActiveQuestionSets(values);
        this._timer = window.setTimeout(this.refresh.bind(this, values), 10000);
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscription.detach();
        clearTimeout(this._timer);
    }

    public get questionSets(): IQuestionSet[] {
        return this._questionSets;
    }
}
