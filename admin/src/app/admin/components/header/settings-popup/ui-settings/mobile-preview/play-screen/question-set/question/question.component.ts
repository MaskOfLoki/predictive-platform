import { IConfig } from '../../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './question.template';

import './question.style.scss';

interface IQuestionAttrs {
  config: IConfig;
}

export class QuestionComponent implements ClassComponent {
  public config: IConfig;
  public countdown: number = 5000;

  public oninit(vnode: Vnode<IQuestionAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IQuestionAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
