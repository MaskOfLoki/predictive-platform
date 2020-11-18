import m from 'mithril';
import {NewSetPopupComponent} from './new-set-popup.component';
import {ToggleComponent} from '../toggle/toggle.component';
import {ScheduleType} from '../../../../../../common';
import {SettingsCountdownComponent} from './settings-countdown/settings-countdown.component';
import {SettingsRangeComponent} from './settings-range/settings-range.component';

export function template(ctrl: NewSetPopupComponent) {
    return (
        <div class='gc-new-set-popup'>
            <div class='title'>NEW SET</div>
            <div class='content'>
                <div class='group-name'>
                    <label>SET NAME</label>
                    <input type='text'
                           class='gc-input'
                           placeholder='Name'
                           value={ctrl.questionSet.name}
                           onkeypress={e => e.target.value.length < 20}
                           oninput={e => ctrl.questionSet.name = e.target.value}/>
                </div>
                <div class='group-schedule'>
                    <div class='label'>
                        SET SCHEDULE
                        <br/>
                        <br/>
                        <div class='timezone'>
                            TIMEZONE:
                            <br/>
                            {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </div>
                    </div>
                    <div class='group-toggles'>
                        <ToggleComponent label='COUNTDOWN'
                                         type='radio'
                                         selected={ctrl.questionSet.scheduleType === ScheduleType.COUNTDOWN}
                                         onchange={() => ctrl.questionSet.scheduleType = ScheduleType.COUNTDOWN}/>
                        <ToggleComponent label='TIME RANGE'
                                         type='radio'
                                         selected={ctrl.questionSet.scheduleType === ScheduleType.RANGE}
                                         onchange={() => ctrl.questionSet.scheduleType = ScheduleType.RANGE}/>
                        <ToggleComponent label='MANUAL'
                                         type='radio'
                                         selected={ctrl.questionSet.scheduleType === ScheduleType.MANUAL}
                                         onchange={() => ctrl.questionSet.scheduleType = ScheduleType.MANUAL}/>
                    </div>
                    {ctrl.questionSet.scheduleType === ScheduleType.COUNTDOWN &&
                    <SettingsCountdownComponent seconds={ctrl.questionSet.countdown} onchange={value => ctrl.questionSet.countdown = value}/>}
                    {ctrl.questionSet.scheduleType === ScheduleType.RANGE &&
                    <SettingsRangeComponent onchange={ctrl.rangeChangeHandler.bind(ctrl)}/>}
                </div>
                <div class='group-messages'>
                    <div class='message'>
                        <label>SET IN-PROGRESS MESSAGE</label>
                        <input type='text'
                            class='gc-input'
                            value={ctrl.questionSet.progressMessage}
                            onkeypress={e => e.target.value.length < 26}
                            oninput={e => ctrl.questionSet.progressMessage = e.target.value}/>
                    </div>
                    <div class='message'>
                        <label>SET COMPLETE MESSAGE</label>
                        <input type='text'
                            class='gc-input'
                            value={ctrl.questionSet.completeMessage}
                            onkeypress={e => e.target.value.length < 26}
                            oninput={e => ctrl.questionSet.completeMessage = e.target.value}/>
                    </div>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE SET
                </div>
            </div>
        </div>
    );
}
