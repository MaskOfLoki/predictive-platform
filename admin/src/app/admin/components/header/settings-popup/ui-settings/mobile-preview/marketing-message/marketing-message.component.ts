import { IConfig } from '../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './marketing-message.template';

import './marketing-message.style.scss';

interface IMarketingMessageAttrs {
  config: IConfig;
}

export class MarketingMessageComponent implements ClassComponent {
  public config: IConfig;

  public oninit(vnode: Vnode<IMarketingMessageAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IMarketingMessageAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }

}
