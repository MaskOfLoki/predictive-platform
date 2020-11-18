import {ClassComponent, Vnode} from 'mithril';
import {template} from './badge.template';
import './badge.component.scss';
import {IQuestion} from '../../../../../../../../../common';

interface IBadgeAttrs {
    question: IQuestion;
    correct: boolean;
}

export class BadgeComponent implements ClassComponent<IBadgeAttrs> {
    private _question: IQuestion;
    private _correct: boolean;

    public oninit(vnode: Vnode<IBadgeAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IBadgeAttrs, this>) {
        this._question = vnode.attrs.question;
        this._correct = vnode.attrs.correct;
    }

    public view() {
        return template(this);
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get isCorrect(): boolean {
        return this._correct;
    }
}
