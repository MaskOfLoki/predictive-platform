import m from 'mithril';
import {BetPropPopupComponent} from './bet-prop-popup.component';
import {ToggleComponent} from '../../../../toggle/toggle.component';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';

export function template(ctrl: BetPropPopupComponent) {
    return (
        <div class='gc-bet-prop-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}/>
            <div class='content'>
                <div class='column-left'>
                    <div class='row'>
                        <div class='group-min-mac'>
                            <div class='group-input'>
                                <label>MIN</label>
                                <input class='gc-input'
                                       type='number'
                                       value={ctrl.question.min}
                                       oninput={e => ctrl.question.min = parseFloat(e.target.value)}
                                       onkeypress={e => e.target.value.length < 6}/>
                            </div>
                            <div class='group-input'>
                                <label>MAX</label>
                                <input class='gc-input'
                                       type='number'
                                       value={ctrl.question.max}
                                       oninput={e => ctrl.question.max = parseFloat(e.target.value)}
                                       onkeypress={e => e.target.value.length < 6}/>
                            </div>
                        </div>
                        <div class='group-left'>
                            <ToggleComponent label='AMERICAN ODDS'
                                             selected={ctrl.question.americanOdds}
                                             onchange={value => ctrl.question.americanOdds = value}/>
                        </div>
                    </div>
                    <span>PROP DESCRIPTION</span>
                    <textarea class='gc-input'
                              value={ctrl.question.description}
                              oninput={e => ctrl.question.description = e.target.value}/>
                </div>
                <div class='column-right'>
                    <span>OUTCOMES</span>
                    <div class='group-outcomes'>
                        {ctrl.question.outcomes.map((outcome, index) =>
                            <div class='group-outcome'>
                                <input class='gc-input input-text'
                                       value={outcome.text}
                                       oninput={e => outcome.text = e.target.value}
                                       onkeypress={e => e.target.value.length < 20}/>
                                <span>ODDS</span>
                                <input class='gc-input input-odds'
                                       type='number'
                                       step='0.01'
                                       value={outcome.odds}
                                       oninput={e => outcome.odds = e.target.value}
                                       onkeypress={e => e.target.value.length < 4}/>
                                <div class='button-remove'
                                     onclick={() => ctrl.question.outcomes.splice(index, 1)}>X
                                </div>
                            </div>)}
                    </div>
                    <div class='gc-button'
                         onclick={() => ctrl.question.outcomes.push({text: '', odds: 0})}>
                        ADD OUTCOME
                    </div>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE BET
                </div>
            </div>
        </div>
    );
}
