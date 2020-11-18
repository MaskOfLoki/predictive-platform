import { IConfig } from '../../../../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './badge.template';

import './badge.style.scss';

interface IBadgeAttrs {
  config: IConfig;
}

export class BadgeComponent implements ClassComponent {
  public config: IConfig;
  public countdown: number = 5000;

  public oninit(vnode: Vnode<IBadgeAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IBadgeAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
