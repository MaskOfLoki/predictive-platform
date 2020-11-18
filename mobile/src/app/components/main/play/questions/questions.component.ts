import {template} from './questions.template';
import './questions.component.scss';
import {ClassComponent, Vnode} from 'mithril';
import {IOpenResponseQuestion, IQuestion, QuestionSubType} from '../../../../../../../common';

interface IQuestionsAttrs {
    questions: IQuestion[];
    locked: boolean;
}

export class QuestionsComponent implements ClassComponent<IQuestionsAttrs> {
    public questions: IQuestion[] = [];
    public locked: boolean = false;

    public oninit(vnode: Vnode<IQuestionsAttrs>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IQuestionsAttrs>) {
        this.questions = vnode.attrs.questions.filter(
            item => (item as IOpenResponseQuestion).subType !== QuestionSubType.LIVE);
        this.locked = vnode.attrs.locked;
    }

    public view() {
        return template(this);
    }
}
