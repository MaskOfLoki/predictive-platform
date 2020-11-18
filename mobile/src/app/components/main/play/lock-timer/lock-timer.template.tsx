import { LockTimerComponent } from './lock-timer.component';
import m from 'mithril';
import { formatTimer } from '../../../../../../../common';
import { configService } from '../../../../services/config';

export function template(ctrl: LockTimerComponent) {
    return (
        <div class={`gc-lock-timer ${ctrl.progressMessage ? 'message' : ''}`}
            style={{ backgroundColor: configService.colors.primary }}>
            {(!!ctrl.countdown || (ctrl.manualOverride && ctrl.progressMessage)) &&
                <div class='title'
                    style={{ color: configService.colors.text4 }}>
                    {!ctrl.progressMessage ? 'QUESTIONS WILL LOCK IN' : ctrl.progressMessage}
                </div>}
            {!!ctrl.countdown && !ctrl.progressMessage &&
                <div class='group-timer'>
                    <div class='icon-timer' style={{ backgroundColor: configService.colors.text4 }} />
                    <span style={{ color: configService.colors.text4 }}>
                        {formatTimer(ctrl.countdown)}
                    </span>
                </div>}
            {!ctrl.countdown && !ctrl.manualOverride && ctrl.render &&
                <div class='locked'
                    style={{ color: configService.colors.text4 }}>
                    {ctrl.completeMessage}
                </div>}
        </div>
    );
}
