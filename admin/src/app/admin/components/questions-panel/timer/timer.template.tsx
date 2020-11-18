import m from 'mithril';
import {TimerComponent} from './timer.component';

export function template(ctrl: TimerComponent) {
    return (
        <div class='gc-timer'>
            <span>TIMER (seconds)</span>
            <input class='gc-input'
                   type='number'
                   value={ctrl.value}
                   readonly={ctrl.readonly}
                   oninput={ctrl.inputHandler.bind(ctrl)}
                   onkeypress={e => e.target.value.length < 6}/>
        </div>
    );
}
