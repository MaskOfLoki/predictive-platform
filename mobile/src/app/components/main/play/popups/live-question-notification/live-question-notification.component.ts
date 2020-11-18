import {template} from './live-question-notification.template';
import './live-question-notification.component.scss';
import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import {IQuestion} from '../../../../../../../../common';
import * as MiniSignal from 'mini-signals';
import {PopupManager} from '../../../../../utils/PopupManager';
import {QuestionPopupFactory} from '../../../../../utils/QuestionPopupFactory';

interface ILiveQuestionNotification {
    question: IQuestion;
    closePopup: MiniSignal;
}

export class LiveQuestionNotificationComponent implements ClassComponent {
    private _question: IQuestion;
    private _closePopup: MiniSignal;
    private _element: HTMLElement;

    public oninit(vnode: Vnode<ILiveQuestionNotification, this>) {
        this._question = vnode.attrs.question;
        this._closePopup = vnode.attrs.closePopup;
    }

    public oncreate(vnode: VnodeDOM<ILiveQuestionNotification, this>): any {
        this._element = vnode.dom as HTMLElement;
    }

    public buttonDismissHandler(): void {
        this._closePopup.dispatch();
    }

    public async buttonAnswerHandler() {
        this._element.style.opacity = '0';
        await PopupManager.show(QuestionPopupFactory.get(this._question.type), {
            question: this._question,
        });
        this.buttonDismissHandler();
    }

    public view() {
        return template(this);
    }

    public get question(): IQuestion {
        return this._question;
    }
}
