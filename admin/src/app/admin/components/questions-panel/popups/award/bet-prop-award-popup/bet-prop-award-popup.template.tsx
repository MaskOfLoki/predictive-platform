import m from 'mithril';
import {BetPropAwardPopupComponent} from './bet-prop-award-popup.component';

export function template(ctrl: BetPropAwardPopupComponent) {
    return (
        <div class='gc-bet-prop-award-popup'>
            <div class='header'>
                <div class='left'>
                    <div class='badge'>BET</div>
                    <span>BET - PROP BET</span>
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
                <div class='group-answers'>
                    {ctrl.question.outcomes.map((outcome, index) =>
                        <div class={`group-answer${ctrl.question.correctAnswer === index ? ' selected' : ''}`}
                             onclick={() => ctrl.question.correctAnswer = index}>
                            <span>
                                {outcome.text}
                            </span>
                            <div class='odds'>
                                {outcome.odds}
                            </div>
                        </div>)}
                </div>
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
