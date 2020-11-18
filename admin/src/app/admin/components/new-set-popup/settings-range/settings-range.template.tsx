import m from 'mithril';
import {SettingsRangeComponent} from './settings-range.component';

export function template(ctrl: SettingsRangeComponent) {
    return (
        <div class='gc-settings-range'>
            <div class='group-input'>
                <span>START TIME</span>
                <input id='input-start' class='gc-input'/>
            </div>
            <div class='group-input'>
                <span>END TIME</span>
                <input id='input-end' class='gc-input'/>
            </div>
        </div>
    );
}
