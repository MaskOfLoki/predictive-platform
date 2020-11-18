import { IConfig } from '../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './mobile-header.template';

import './mobile-header.style.scss';

interface IMobilePreviewAttrs {
  config: IConfig;
  selectedTab: number;
}

export class MobileHeaderComponent implements ClassComponent {
  public config: IConfig;
  public selectedTab: number = 0;

  public oninit(vnode: Vnode<IMobilePreviewAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IMobilePreviewAttrs, this>) {
    this.config = vnode.attrs.config;
    this.selectedTab = vnode.attrs.selectedTab;
  }

  public view() {
    return template(this);
  }
}
