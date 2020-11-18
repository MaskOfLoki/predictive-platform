import m from 'mithril';
import {MultiChoiceAwardPopupComponent} from './multi-choice-award-popup.component';
import {BadgeComponent} from '../../../badge/badge.component';

export function template(ctrl: MultiChoiceAwardPopupComponent) {
    return (
        <div class='gc-multi-choice-award-popup'>
            <div class='header'>
                <div class='left'>
                    <BadgeComponent question={ctrl.question}/>
                    <span>QUESTION - MULTIPLE CHOICE</span>
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
                <div class='group-answers'>
                    {ctrl.question.answers.map(answer =>
                        <div class={`group-answer${ctrl.question.correctAnswer === answer ? ' selected' : ''}`}
                             onclick={() => ctrl.question.correctAnswer = answer}
                             style={{width: `${Math.floor(100 / ctrl.question.answers.length) - 2}%`}}>
                            <span>
                                {answer}
                            </span>
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
