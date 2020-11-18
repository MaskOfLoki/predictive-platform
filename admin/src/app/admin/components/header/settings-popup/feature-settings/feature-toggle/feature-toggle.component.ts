import m, { ClassComponent, Vnode } from 'mithril';
import { template } from './feature-toggle.template';

import './feature-toggle.component.scss';

interface IFeatureToggleAttrs {
  label: string;
  value: boolean;
  onchange: (value: boolean) => void;
}

export class FeatureToggleComponent implements ClassComponent<IFeatureToggleAttrs> {
  public label: string;
  public value: boolean;
  private _onchange: (value: boolean) => void;

  public oninit(vnode: Vnode<IFeatureToggleAttrs, this>): void {
    this.label = vnode.attrs.label;
    this._onchange = vnode.attrs.onchange;
    this.value = vnode.attrs.value;
  }

  public toggle(): void {
    this.value = !this.value;
    this._onchange(this.value);
    m.redraw();
  }

  public view() {
    return template(this);
  }
}
