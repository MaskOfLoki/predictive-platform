import m from 'mithril';
import {ColorPickerComponent} from './color-picker.component';

export function template(ctrl: ColorPickerComponent) {
    return (
        <div class='gc-color-picker'>
            <div class='label'>{ctrl.label}</div>
            <div class='color-picker' style={{backgroundColor: ctrl.color}}/>
        </div>
    );
}
