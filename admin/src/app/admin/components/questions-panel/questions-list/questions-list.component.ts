import {ClassComponent, Vnode} from 'mithril';
import {template} from './questions-list.template';
import './questions-list.component.scss';
import * as Stream from 'mithril/stream';
import {IQuestion, IQuestionSet} from '../../../../../../../common';

interface IQuestionsListAttrs {
    questions: Stream.Stream<IQuestionSet[]>;
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

export class QuestionsListComponent implements ClassComponent<IQuestionsListAttrs> {
    private _questionSets: Stream.Stream<IQuestionSet[]> = Stream([]);
    private _ondelete: (question: IQuestion) => void;
    private _onedit: (question: IQuestion, isAward: boolean) => void;
    private _onmakelive: (question: IQuestion) => void;
    private _onmoveup: (question: IQuestion) => void;
    private _onmovedown: (question: IQuestion) => void;
    private _onsetmoveup: (question: IQuestionSet) => void;
    private _onsetmovedown: (question: IQuestionSet) => void;
    private _onsaveevent: () => void;
    private _isLive: boolean;

    public oninit(vnode: Vnode<IQuestionsListAttrs, this>) {
        this._questionSets = vnode.attrs.questions;
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

    public onbeforeupdate(vnode: Vnode<IQuestionsListAttrs, this>) {
        this._isLive = vnode.attrs.isLive;
    }

    public buttonEditHandler(question: IQuestion, isAward: boolean) {
        this._onedit(question, isAward);
    }

    public buttonRemoveHandler(question: IQuestion) {
        this._ondelete(question);
    }

    public view() {
        return template(this);
    }

    public get questionSets(): Stream.Stream<IQuestionSet[]> {
        return this._questionSets;
    }

    public get isLive(): boolean {
        return this._isLive;
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
}
