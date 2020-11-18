import m from 'mithril';
import {BetMoneylineAwardPopupComponent} from './bet-moneyline-award-popup.component';
import {TeamSelectorsComponent} from '../../../team-selectors/team-selectors.component';
import {QuestionType} from '../../../../../../../../../common';

const labels = {
    [QuestionType.BET_MONEYLINE]: 'BET - MONEYLINE',
    [QuestionType.BET_POINT_SPREAD]: 'BET - POINT SPREAD',
    [QuestionType.BET_OVER_UNDER]: 'BET - OVER-UNDER',
};

export function template(ctrl: BetMoneylineAwardPopupComponent) {
    return (
        <div class='gc-bet-moneyline-award-popup'>
            <div class='header'>
                <div class='left'>
                    <div class='badge'>BET</div>
                    <span>{labels[ctrl.question.type]}</span>
                </div>
                <div class='right'>
                    <div class='button'
                         onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
                    </div>
                </div>
            </div>
            <div class='content'>
                <div class='title'>
                    Choose the winner below to score this bet!
                </div>
                <TeamSelectorsComponent question={ctrl.question}/>
            </div>
            <div class='buttons'>
                <div class='button'
                     onclick={ctrl.buttonPushHandler.bind(ctrl)}>
                    PUSH
                </div>
                <div class='line'/>
                <div class='button'
                     onclick={ctrl.buttonAwardHandler.bind(ctrl)}>
                    SCORE
                </div>
            </div>
        </div>
    );
}
