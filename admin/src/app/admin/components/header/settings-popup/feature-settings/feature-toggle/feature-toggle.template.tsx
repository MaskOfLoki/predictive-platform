import m from 'mithril';
import { FeatureToggleComponent } from './feature-toggle.component';

export function template(ctrl: FeatureToggleComponent) {
  return (<div class='gc-feature-toggle'>
    <div class='label'>
      <div>{ctrl.label}</div>
    </div>
    <div class='toggle'>
      <div class='gc-button' onclick={ctrl.toggle.bind(ctrl)}>{ctrl.value ? 'ENABLED' : 'DISABLED'}</div>
    </div>
  </div>);
}
