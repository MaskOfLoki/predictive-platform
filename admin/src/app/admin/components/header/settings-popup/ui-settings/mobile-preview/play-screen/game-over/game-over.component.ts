import { IConfig } from '../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
// import {template} from './play-screen.template';

import './game-over.style.scss';

interface IGameOverAttrs {
  config: IConfig;
}

export class GameOverComponent implements ClassComponent {
  public config: IConfig;

  public oninit(vnode: Vnode<IGameOverAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IGameOverAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    // return template(this);
    return null;
  }
}
