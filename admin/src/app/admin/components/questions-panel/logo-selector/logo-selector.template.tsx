import m from 'mithril';
import {LogoSelectorComponent} from './logo-selector.component';

export function template(ctrl: LogoSelectorComponent) {
    return (
        <div class='gc-logo-selector'>
            <div class='image'
                 style={{backgroundImage: ctrl.image ? `url(${ctrl.image.url})` : null}}>
                {ctrl.image ? '' : '?'}
            </div>
            <div class='label'>{ctrl.label}</div>
            <div class='gc-button'
                 onclick={ctrl.buttonUploadClearHandler.bind(ctrl)}>
                {ctrl.image ? 'CLEAR' : 'UPLOAD'}
            </div>
            <div class='label-format'>
                {ctrl.description}
            </div>
        </div>
    );
}
