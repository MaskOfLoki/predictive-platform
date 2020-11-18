import m from 'mithril';
import {BadgeComponent} from './badge.component';

export function template(ctrl: BadgeComponent) {
    return (
        <div class='gc-question-badge'
             style={{backgroundColor: ctrl.color}}
             onclick={ctrl.clickHandler.bind(ctrl)}>
            {ctrl.label}
        </div>
    );
}
