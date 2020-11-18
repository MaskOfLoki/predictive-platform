import m from 'mithril';
import {BadgeComponent} from './badge.component';

export function template(ctrl: BadgeComponent) {

    return (
        <div class='gc-mobile-question-badge'
            style={{
                backgroundColor: ctrl.config.colors.primary,
                color: ctrl.config.colors.text4,
                borderColor: ctrl.config.colors.primary,
            }}>
            ANSWER NOW!
        </div>
    );
}
