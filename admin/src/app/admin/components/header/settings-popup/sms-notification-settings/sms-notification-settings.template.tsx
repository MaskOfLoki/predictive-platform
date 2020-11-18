import m from 'mithril';
import {SmsNotificationSettingsComponent} from './sms-notification-settings.component';

export function template(ctrl: SmsNotificationSettingsComponent) {
    return (
        <div class='gc-sms-notification-settings'>
            <div class='content'>
                <div class='label'>MESSAGE:</div>
                <input class='gc-input'
                       value={ctrl.text}
                       oninput={e => ctrl.text = e.target.value}
                       onkeypress={e => e.target.value.length < 140}/>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonSendHandler.bind(ctrl)}>
                    SEND
                </div>
            </div>
        </div>
    );
}
