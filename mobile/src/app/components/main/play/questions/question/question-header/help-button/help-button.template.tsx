import m from 'mithril';
import { HelpButtonComponent } from './help-button.component';
import { configService } from '../../../../../../../services/config';

export function template(ctrl: HelpButtonComponent) {
    return (
        <div class='gc-help-button'
            style={{ backgroundColor: configService.colors.primary, color: configService.colors.text4 }}
            onclick={ctrl.clickHandler.bind(ctrl)}>
            ?
        </div>
    );
}
