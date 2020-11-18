import m, { Vnode } from 'mithril';
import { AccordionComponent } from './accordion.component';
import cx from 'classnames';

export function template(ctrl: AccordionComponent, vnode: Vnode) {
  return (
    <div class={`gc-accordion ${ctrl.isOpen ? 'open' : ''}`}>
      <div
        class='gc-accordion-header'
        onclick={() => (ctrl.isOpen = !ctrl.isOpen)}
      >
        <div class={cx('arrow', { open: ctrl.isOpen })} />
        <div class='label'>{ctrl.label}</div>
      </div>
      {ctrl.isOpen && m('.gc-accordion-content', vnode.children)}
    </div>
  );
}
