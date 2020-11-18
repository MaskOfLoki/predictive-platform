import { IConfig } from '../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
// import {template} from './play-screen.template';

import './live-questions.style.scss';

interface ILiveQuestionsAttrs {
  config: IConfig;
}

export class LiveQuestionsComponent implements ClassComponent {
  public config: IConfig;

  public oninit(vnode: Vnode<ILiveQuestionsAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<ILiveQuestionsAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    // return template(this);
    return null;
  }
}
