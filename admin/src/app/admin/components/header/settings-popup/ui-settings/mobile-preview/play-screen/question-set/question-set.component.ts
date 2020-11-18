import { IConfig } from '../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './question-set.template';

import './question-set.style.scss';

interface IQuestionSetAttrs {
  config: IConfig;
}

export class QuestionSetComponent implements ClassComponent {
  public config: IConfig;
  public countdown: number = 5000;

  public oninit(vnode: Vnode<IQuestionSetAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IQuestionSetAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
