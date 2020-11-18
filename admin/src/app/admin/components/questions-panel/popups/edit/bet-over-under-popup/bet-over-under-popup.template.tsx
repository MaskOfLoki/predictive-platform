import m from 'mithril';
import {BetOverUnderPopupComponent} from './bet-over-under-popup.component';
import {LogoSelectorComponent} from '../../../logo-selector/logo-selector.component';
import {ToggleComponent} from '../../../../toggle/toggle.component';
import {getNumberSign} from '../../../../../../../../../common';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';

export function template(ctrl: BetOverUnderPopupComponent) {
    return (
        <div class='gc-bet-over-under-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}/>
            <div class='group-tabs'>
                {ctrl.question.teamA.outcomes.map((value, index) =>
                    <div class={`tab${ctrl.selectedOutcomeIndex === index ? ' active' : ''}`}
                         onclick={ctrl.tabHandler.bind(ctrl, index)}>
                        {index + 1}
                    </div>)}
                {ctrl.question.teamA.outcomes.length < 3 &&
                <div class='tab'
                     onclick={ctrl.buttonAddOutcomeHandler.bind(ctrl)}>
                    +
                </div>}
            </div>
            <div class='content'>
                <div class='column'>
                    <div class='row'>
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
                    <div class='row'>
                        <div class='group-left'>
                            <ToggleComponent label='AMERICAN ODDS'
                                             selected={ctrl.question.americanOdds}
                                             onchange={value => ctrl.question.americanOdds = value}/>
                        </div>
                        <div class='group-teams'>
                            <div class='column'>
                                <div class='team'>{ctrl.question.teamA.name}</div>
                                {!isNaN(ctrl.teamAOver) &&
                                <div class='spread'>
                                    {getNumberSign(ctrl.teamAOver) + ctrl.teamAOver}
                                </div>}
                                <div class='odds'>
                                    {!isNaN(parseFloat(ctrl.teamAOdds)) && parseFloat(ctrl.teamAOdds)}
                                    {isNaN(parseFloat(ctrl.teamAOdds)) && '---'}
                                </div>
                            </div>
                            <div class='column'>
                                <div class='team'>{ctrl.question.teamB.name}</div>
                                {!isNaN(ctrl.teamBUnder) &&
                                <div class='spread'>
                                    {getNumberSign(ctrl.teamBUnder) + ctrl.teamBUnder}
                                </div>}
                                <div class='odds'>
                                    {!isNaN(parseFloat(ctrl.teamBOdds)) && parseFloat(ctrl.teamBOdds)}
                                    {isNaN(parseFloat(ctrl.teamBOdds)) && '---'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='group-input'>
                            <label>TEAM A</label>
                            <input class='gc-input'
                                   value={ctrl.question.teamA.name}
                                   oninput={e => ctrl.question.teamA.name = e.target.value}
                                   onkeypress={e => e.target.value.length < 20}/>
                        </div>
                        <div class='group-spread-odds'>
                            <div class='group-input'>
                                <label>OVER</label>
                                <input type='number'
                                       class='gc-input'
                                       step='0.01'
                                       value={ctrl.teamAOver}
                                       oninput={e => ctrl.teamAOver = parseFloat(e.target.value)}
                                       onkeypress={e => e.target.value.length < 4}/>
                            </div>
                            <div class='group-input'>
                                <label>ODDS</label>
                                <input type='number'
                                       class='gc-input'
                                       step='0.01'
                                       value={ctrl.teamAOdds}
                                       oninput={e => ctrl.teamAOdds = e.target.value}
                                       onkeypress={e => e.target.value.length < 4}/>
                            </div>
                        </div>

                    </div>
                    <div class='row'>
                        <div class='group-input'>
                            <label>TEAM B</label>
                            <input class='gc-input'
                                   value={ctrl.question.teamB.name}
                                   oninput={e => ctrl.question.teamB.name = e.target.value}
                                   onkeypress={e => e.target.value.length < 20}/>
                        </div>
                        <div class='group-spread-odds'>
                            <div class='group-input'>
                                <label>UNDER</label>
                                <input type='number'
                                       class='gc-input'
                                       step='0.01'
                                       value={ctrl.teamBUnder}
                                       oninput={e => ctrl.teamBUnder = parseFloat(e.target.value)}
                                       onkeypress={e => e.target.value.length < 4}/>
                            </div>
                            <div class='group-input'>
                                <label>ODDS</label>
                                <input type='number'
                                       class='gc-input'
                                       step='0.01'
                                       value={ctrl.teamBOdds}
                                       oninput={e => ctrl.teamBOdds = e.target.value}
                                       onkeypress={e => e.target.value.length < 4}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='group-logos'>
                    <span>LOGOS</span>
                    <LogoSelectorComponent label={ctrl.question.teamA.name}
                                           image={ctrl.question.teamA.logo}
                                           onchange={value => ctrl.question.teamA.logo = value}/>
                    <div class='line'/>
                    <LogoSelectorComponent label={ctrl.question.teamB.name}
                                           image={ctrl.question.teamB.logo}
                                           onchange={value => ctrl.question.teamB.logo = value}/>
                </div>
            </div>
            <div class='buttons'>
                {ctrl.question.teamA.outcomes.length > 1 &&
                <div class='button' onclick={ctrl.buttonRemoveOutcomeHandler.bind(ctrl)}>
                    REMOVE CURRENT OUTCOME
                </div>}
                {ctrl.question.teamA.outcomes.length > 1 && <div class='line'/>}
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
