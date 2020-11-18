import m from 'mithril';
import {FontPickerComponent} from './font-picker.component';

export function template(ctrl: FontPickerComponent) {
    return (
        <div class='gc-font-picker'>
            <div class='title'>FONT: {ctrl.font ? ctrl.font.name : ''}</div>
            <div class='gc-button'
                 onclick={ctrl.buttonUploadHandler.bind(ctrl)}>
                {ctrl.font ? 'REMOVE' : 'UPLOAD'}
            </div>
        </div>
    );
}
