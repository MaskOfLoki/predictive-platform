import {LockTimerComponent} from './lock-timer.component';
import m from 'mithril';
import {formatTimer} from '../../../../../../../../../../../common';

export function template(ctrl: LockTimerComponent) {
    return (
        <div class='gc-lock-timer'
             style={{backgroundColor: ctrl.config.colors.primary}}>
            <div class='title'
                 style={{color: ctrl.config.colors.text4}}>
                QUESTIONS WILL LOCK IN
            </div>
            <div class='group-timer'>
                <div class='icon-timer' style={{backgroundColor: ctrl.config.colors.text4}}/>
                <span style={{color: ctrl.config.colors.text4}}>
                    {formatTimer(ctrl.countdown)}
                </span>
            </div>
        </div>
    );
}
