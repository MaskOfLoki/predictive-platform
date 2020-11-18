import m from 'mithril';
import {QuestionOpenResponsePopupComponent} from './question-open-response-popup.component';
import {ToggleComponent} from '../../../../toggle/toggle.component';
import {QuestionSubType} from '../../../../../../../../../common';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';
import {TimerComponent} from '../../../timer/timer.component';

export function template(ctrl: QuestionOpenResponsePopupComponent) {
    return (
        <div class='gc-question-open-response-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}/>
            <div class='content'>
                <div class='column-left'>
                    <div class='group-input'>
                        <label>QUESTION</label>
                        <input class='gc-input'
                               value={ctrl.question.question}
                               oninput={e => ctrl.question.question = e.target.value}
                               onkeypress={e => e.target.value.length < 100}/>
                    </div>
                    <div class='group-input'>
                        <label>SUBHEADER</label>
                        <input class='gc-input'
                               value={ctrl.question.subHeader}
                               oninput={e => ctrl.question.subHeader = e.target.value}
                               onkeypress={e => e.target.value.length < 100}/>
                    </div>
                </div>
                <div class='column-right'>
                    <ToggleComponent type='radio'
                                     label='PREDICTIVE'
                                     selected={ctrl.question.subType === QuestionSubType.PREDICTIVE}
                                     onchange={selected => ctrl.subTypeChangeHandler(QuestionSubType.PREDICTIVE, selected)}/>
                    <ToggleComponent type='radio'
                                     label='LIVE'
                                     selected={ctrl.question.subType === QuestionSubType.LIVE}
                                     onchange={selected => ctrl.subTypeChangeHandler(QuestionSubType.LIVE, selected)}/>
                    {ctrl.question.subType === QuestionSubType.LIVE && <div class='line'/>}
                    {ctrl.question.subType === QuestionSubType.LIVE &&
                    <TimerComponent value={ctrl.question.timer}
                                    onchange={value => ctrl.question.timer = value}/>}
                    <div class='line'/>
                    <span>POINTS</span>
                    <input class='gc-input'
                           type='number'
                           value={ctrl.question.points}
                           oninput={e => ctrl.question.points = parseInt(e.target.value)}
                           onkeypress={e => e.target.value.length < 6}/>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE QUESTION
                </div>
            </div>
        </div>
    );
}
