import {template} from './question-header.template';
import './question-header.component.scss';
import {ClassComponent, Vnode} from 'mithril';
import {IQuestion} from '../../../../../../../../../common';
import {getQuestionHelp} from '../../../../../../utils/help';

interface IQuestionAttrs {
    question: IQuestion;
    correct: boolean;
    label: string;
    payout: number;
    wager: number;
}

export class QuestionHeaderComponent implements ClassComponent<IQuestionAttrs> {
    private _question: IQuestion;
    private _correct: boolean;
    private _label: string;
    private _payout: number;
    private _wager: number;

    public oninit(vnode: Vnode<IQuestionAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionAttrs, this>) {
        this._question = vnode.attrs.question;
        this._correct = vnode.attrs.correct;
        this._label = vnode.attrs.label;
        this._payout = vnode.attrs.payout;
        this._wager = vnode.attrs.wager;
    }

    public view() {
        return template(this);
    }

    public get isCorrect(): boolean {
        return this._correct;
    }

    public get label(): string {
        return this._label;
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get payout(): number {
        return this._payout;
    }

    public get hasHelp(): boolean {
        return !!getQuestionHelp(this._question.type);
    }

    public get wager(): number {
        return this._wager;
    }
}
