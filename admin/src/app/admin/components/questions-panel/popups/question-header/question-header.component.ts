import {ClassComponent, Vnode} from 'mithril';
import {template} from './question-header.template';
import './question-header.component.scss';
import {IQuestion} from '../../../../../../../../common';
import {isEmptyString} from '@gamechangerinteractive/gc-firebase/utils';
import {PopupManager} from '../../../../utils/PopupManager';

interface IQuestionHeaderAttrs {
    question: IQuestion;
    onclose: () => void;
    help?: string;
}

export class QuestionHeaderComponent implements ClassComponent<IQuestionHeaderAttrs> {
    private _question: IQuestion;
    private _onclose: () => void;
    private _help: string;

    public oninit(vnode: Vnode<IQuestionHeaderAttrs, this>) {
        this._question = vnode.attrs.question;
        this._onclose = vnode.attrs.onclose;
        this._help = vnode.attrs.help;
    }

    public buttonCloseHandler() {
        if (this._onclose) {
            this._onclose();
        }
    }

    public buttonHelpHandler() {
        PopupManager.warning(this._help, 'HELP');
    }

    public view() {
        return template(this);
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get showHelp(): boolean {
        return !isEmptyString(this._help);
    }
}
