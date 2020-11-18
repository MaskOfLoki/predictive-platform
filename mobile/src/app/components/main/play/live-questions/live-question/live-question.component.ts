import { template } from './live-question.template';
import './live-question.component.scss';
import { Vnode } from 'mithril';
import { getLeftTime } from '../../../../../../../../common';
import m from 'mithril';
import { QuestionComponent, IQuestionAttrs } from '../../questions/question/question.component';

export class LiveQuestionComponent extends QuestionComponent {
    private _timer: number;

    constructor() {
        super();
    }

    public oninit(vnode: Vnode<IQuestionAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionAttrs, this>) {
        super.onbeforeupdate(vnode);

        this._question.countdown = getLeftTime(this._question);
        this._question.locked = this._question.countdown <= 0;

        if (this._timer == null && this._question.countdown > 0) {
            this._timer = window.setTimeout(this.tickHandler.bind(this), 0);
        }
    }

    private tickHandler(): void {
        this._question.countdown = getLeftTime(this._question);
        this._question.locked = this._question.countdown <= 0;
        m.redraw();

        if (this._question.countdown > 0) {
            this._timer = window.setTimeout(this.tickHandler.bind(this), 0);
        } else {
            this._timer = null;
        }
    }

    public view() {
        return template(this);
    }
}
