import {ClassComponent, Vnode} from 'mithril';
import {template} from './badge.template';
import './badge.component.scss';
import {IOpenResponseQuestion, IQuestion, QuestionSubType, QuestionType} from '../../../../../../../common';

interface IBadgeAttrs {
    question: IQuestion;
    label?: string;
    color?: string;
    onclick: () => void;
}

const labels = {
    [QuestionType.POLL_OPEN_RESPONSE]: 'POLL',
    [QuestionType.POLL_MULTIPLE_CHOICE]: 'POLL',
    [QuestionType.BET_OVER_UNDER]: 'BET',
    [QuestionType.BET_PROP]: 'BET',
    [QuestionType.BET_POINT_SPREAD]: 'BET',
    [QuestionType.BET_MONEYLINE]: 'BET',
    [QuestionType.BANNER_IMAGE]: 'IMG',
};

const subLabels = {
    [QuestionSubType.PREDICTIVE]: 'PRED',
    [QuestionSubType.TRIVIA]: 'TRIV',
    [QuestionSubType.LIVE]: 'LIVE',
};

const colors = {
    [QuestionType.POLL_OPEN_RESPONSE]: '#004BB2',
    [QuestionType.POLL_MULTIPLE_CHOICE]: '#004BB2',
    [QuestionType.BET_OVER_UNDER]: '#00B21B',
    [QuestionType.BET_PROP]: '#00B21B',
    [QuestionType.BET_POINT_SPREAD]: '#00B21B',
    [QuestionType.BET_MONEYLINE]: '#00B21B',
    [QuestionType.BANNER_IMAGE]: '#484',
};

const subColors = {
    [QuestionSubType.PREDICTIVE]: '#8900B2',
    [QuestionSubType.TRIVIA]: '#B20067',
    [QuestionSubType.LIVE]: '#D18100',
};

export class BadgeComponent implements ClassComponent<IBadgeAttrs> {
    private _label: string;
    private _color: string;
    private _onclick: () => void;

    public oninit(vnode: Vnode<IBadgeAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IBadgeAttrs, this>) {
        this._onclick = vnode.attrs.onclick;
        const question = vnode.attrs.question;

        if (question) {
            const subType: QuestionSubType = (question as IOpenResponseQuestion).subType;

            if (subType) {
                this._color = subColors[subType];
                this._label = subLabels[subType];
            } else {
                this._color = colors[question.type];
                this._label = labels[question.type];
            }
        } else {
            this._color = vnode.attrs.color;
            this._label = vnode.attrs.label;
        }
    }

    public clickHandler(): void {
        if (this._onclick) {
            this._onclick();
        }
    }

    public view() {
        return template(this);
    }

    public get label(): string {
        return this._label;
    }

    public get color(): string {
        return this._color;
    }
}
