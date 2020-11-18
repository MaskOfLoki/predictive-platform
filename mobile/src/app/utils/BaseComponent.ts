import m from 'mithril';
import {delay} from '@gamechangerinteractive/gc-firebase/utils';

export abstract class BaseComponent implements m.ClassComponent {
  public onbeforeremove(vnode) {
    if (vnode.dom) {
      vnode.dom.classList.add('gc-exit');
      return delay(500);
    }
  }

  public abstract view(vnode: any);
}
