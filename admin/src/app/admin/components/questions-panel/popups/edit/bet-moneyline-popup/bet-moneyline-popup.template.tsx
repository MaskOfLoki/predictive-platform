import m from 'mithril';
import {BetMoneylinePopupComponent} from './bet-moneyline-popup.component';
import {LogoSelectorComponent} from '../../../logo-selector/logo-selector.component';
import {ToggleComponent} from '../../../../toggle/toggle.component';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';

export function template(ctrl: BetMoneylinePopupComponent) {
    return (
        <div class='gc-bet-moneyline-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}/>
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
                                <div class='teams'>
                                    {ctrl.question.teamA.name}
                                </div>
                                <div class='odds'>
                                    {!isNaN(parseFloat(ctrl.teamAOdds)) && parseFloat(ctrl.teamAOdds)}
                                    {isNaN(parseFloat(ctrl.teamAOdds)) && '---'}
                                </div>
                            </div>
                            <div class='column'>
                                <div class='teams'>
                                    {ctrl.question.teamB.name}
                                </div>
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
                    <div class='row'>
                        <div class='group-input'>
                            <label>TEAM B</label>
                            <input class='gc-input'
                                   value={ctrl.question.teamB.name}
                                   oninput={e => ctrl.question.teamB.name = e.target.value}
                                   onkeypress={e => e.target.value.length < 20}/>
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
