import m from 'mithril';
import {ToggleComponent} from './toggle.component';
import {isEmptyString} from '../../../../../../common';

export function template(ctrl: ToggleComponent) {
    return (
        <div class='gc-toggle'
             onclick={ctrl.clickHandler.bind(ctrl)}>
            <div class='toggle-image'
                 // tslint:disable-next-line
                 style={{backgroundImage: `url(assets/images/admin/${ctrl.type}${ctrl.selected ? '-selected' : ''}.png)`}}/>
            {!isEmptyString(ctrl.label) &&
            <span>{ctrl.label}</span>}
        </div>
    );
}
