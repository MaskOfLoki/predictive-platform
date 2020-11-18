import m from 'mithril';
import {SettingsCountdownComponent} from './settings-countdown.component';

export function template(ctrl: SettingsCountdownComponent) {
    return (
        <div class='gc-settings-countdown'>
            <div class='group-input'>
                <span>HOURS</span>
                <input class='gc-input'
                       type='number'
                       value={ctrl.hours}
                       oninput={ctrl.inputHoursHandler.bind(ctrl)}/>
            </div>
            <div class='group-input'>
                <span>MINUTES</span>
                <input class='gc-input'
                       type='number'
                       value={ctrl.minutes}
                       oninput={ctrl.inputMinutesHandler.bind(ctrl)}/>
            </div>
            <div class='group-input'>
                <span>SECONDS</span>
                <input class='gc-input'
                       type='number'
                       value={ctrl.seconds}
                       oninput={ctrl.inputSecondsHandler.bind(ctrl)}/>
            </div>
        </div>
    );
}
