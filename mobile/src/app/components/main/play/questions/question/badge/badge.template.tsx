import m from 'mithril';
import { BadgeComponent } from './badge.component';
import { getColor, getLabel } from '../../../../../../utils';
import { configService } from '../../../../../../services/config';

export function template(ctrl: BadgeComponent) {
    const label = getLabel(ctrl.question, ctrl.isCorrect);
    let extraClass = '';
    if (label === 'PUSHED') {
        extraClass = 'black';
    }

    return (
        <div class={`gc-question-badge ${extraClass}`}
            style={{
                backgroundColor: getColor(ctrl.question, ctrl.isCorrect, configService.colors),
                color: extraClass !== 'black' ? configService.colors.text4 : null,
                borderColor: configService.colors.primary,
            }}>
            {label}
        </div>
    );
}
