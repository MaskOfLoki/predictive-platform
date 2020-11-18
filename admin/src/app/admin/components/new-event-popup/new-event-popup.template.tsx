import m from 'mithril';
import {NewEventPopupComponent} from './new-event-popup.component';
import { ToggleComponent } from '../toggle/toggle.component';
import { EventType } from '../../../../../../common';

export function template(ctrl: NewEventPopupComponent) {
    return (
        <div class='gc-new-event-popup'>
            <div class='title'>NEW EVENT</div>
            <div class='content'>
                <label>Name</label>
                <input type='text'
                       placeholder='Name'
                       value={ctrl.event.id}
                       onkeypress={e => e.target.value.length < 20}
                       oninput={e => ctrl.event.id = e.target.value}/>
                {!ctrl.editing && <label class='radio-container-label'>Type</label>}
                {!ctrl.editing && <div class='radio-container'>
                    <ToggleComponent label='Predictive'
                                    type='radio'
                                    selected={ctrl.event.type === EventType.PREDICTIVE}
                                    onchange={() => ctrl.event.type = EventType.PREDICTIVE}/>
                    <ToggleComponent label='Betting'
                                    type='radio'
                                    selected={ctrl.event.type === EventType.BETTING}
                                    onchange={() => ctrl.event.type = EventType.BETTING}/>
                </div>}
                <div class='group-messages'>
                    <div class='message'>
                        <label>IN-PROGRESS MESSAGE</label>
                        <input type='text'
                            class='gc-input'
                            value={ctrl.event.progressMessage}
                            onkeypress={e => e.target.value.length < 26}
                            oninput={e => ctrl.event.progressMessage = e.target.value}/>
                    </div>
                    <div class='message'>
                        <label>COMPLETE MESSAGE</label>
                        <input type='text'
                            class='gc-input'
                            value={ctrl.event.completeMessage}
                            onkeypress={e => e.target.value.length < 26}
                            oninput={e => ctrl.event.completeMessage = e.target.value}/>
                    </div>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE
                </div>
            </div>
        </div>
    );
}
