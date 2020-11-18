import { IConfig } from '../../../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './question-header.template';

import './question-header.style.scss';

interface IQuestionHeaderAttrs {
  config: IConfig;
}

export class QuestionHeaderComponent implements ClassComponent {
  public config: IConfig;
  public countdown: number = 5000;

  public oninit(vnode: Vnode<IQuestionHeaderAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IQuestionHeaderAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
