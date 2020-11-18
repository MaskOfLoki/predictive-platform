import { IConfig } from '../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './lock-timer.template';

import './lock-timer.style.scss';

interface ILockTimerAttrs {
  config: IConfig;
}

export class LockTimerComponent implements ClassComponent {
  public config: IConfig;
  public countdown: number = 5000;

  public oninit(vnode: Vnode<ILockTimerAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<ILockTimerAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
