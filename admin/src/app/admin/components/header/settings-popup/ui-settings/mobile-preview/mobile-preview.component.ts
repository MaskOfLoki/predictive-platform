import { ClassComponent, Vnode } from 'mithril';
import { IConfig } from '../../../../../../../../../common';
import { template } from './mobile-preview.template';

import './mobile-preview.style.scss';

interface IMobilePreviewAttrs {
  config: IConfig;
}

export class MobilePreviewComponent implements ClassComponent {
  public config: IConfig;
  public selectedTab: number = 0;

  public oninit(vnode: Vnode<IMobilePreviewAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IMobilePreviewAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }

}
