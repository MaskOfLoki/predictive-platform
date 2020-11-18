import m from 'mithril';
import {OpenResponseAwardPopupComponent} from './open-response-award-popup.component';
import {BadgeComponent} from '../../../badge/badge.component';

export function template(ctrl: OpenResponseAwardPopupComponent) {
    return (
        <div class='gc-open-response-award-popup'>
            <div class='header'>
                <div class='left'>
                    <BadgeComponent question={ctrl.question}/>
                    <span>QUESTION - OPEN RESPONSE</span>
                </div>
                <div class='right'>
                    <div class='button'
                         onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
                    </div>
                </div>
            </div>
            <div class='content'>
                <div class='title'>
                    Choose the outcome below to score this bet!
                </div>
                <div class='question'>
                    {ctrl.question.question}
                </div>
                <input class='gc-input'
                       value={ctrl.question.correctAnswer}
                       oninput={e => ctrl.question.correctAnswer = e.target.value}/>
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
