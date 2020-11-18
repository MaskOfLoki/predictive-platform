import m from 'mithril';
import {QuestionComponent} from './question.component';
import {BadgeComponent} from '../../badge/badge.component';
import {
    formatTimer,
    IOpenResponseQuestion, isEmptyString, isPredictive,
    QuestionSubType,
    QuestionType,
} from '../../../../../../../../common';

const labels = {
    [QuestionType.BET_MONEYLINE]: 'Moneyline',
    [QuestionType.BET_POINT_SPREAD]: 'Point Spread',
    [QuestionType.BET_PROP]: 'Prop',
    [QuestionType.BET_OVER_UNDER]: 'Over-Under',
    [QuestionType.POLL_MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.QUESTION_MULTIPLE_CHOICE]: 'Multiple Choice',
    [QuestionType.POLL_OPEN_RESPONSE]: 'Open Response',
    [QuestionType.QUESTION_OPEN_RESPONSE]: 'Open Response',
};

export function template(ctrl: QuestionComponent) {
    const isAwarded = ctrl.isStarted && ctrl.question.awarded;
    let cls = 'gc-question';

    if (isAwarded) {
        cls += ' awarded';
    }

    let label: string;

    if (isPredictive(ctrl.question)) {
        label = (ctrl.question as IOpenResponseQuestion).question;
    } else {
        label = ctrl.question.title;
    }

    if (isEmptyString(label)) {
        label = labels[ctrl.question.type];
    }

    return (
        <div class={cls}
             onclick={ctrl.buttonEditHandler.bind(ctrl)}>
            <BadgeComponent question={ctrl.question}/>
            <div class='label'
                 style={{width: ctrl.isStarted ? '82%' : '77%'}}>
                {label}
            </div>
            {ctrl.isStarted &&
            (ctrl.question as IOpenResponseQuestion).subType === QuestionSubType.LIVE &&
            !ctrl.question.locked &&
            !ctrl.question.awarded &&
            !ctrl.question.startTime &&
            <button class='button-make-live'
                    onclick={ctrl.buttonMakeLiveHandler.bind(ctrl)}>
                MAKE LIVE
            </button>}
            {ctrl.isStarted &&
            (ctrl.question as IOpenResponseQuestion).subType === QuestionSubType.LIVE &&
            !ctrl.question.locked &&
            !ctrl.question.awarded &&
            ctrl.question.startTime &&
            ctrl.timer > 0 &&
            <div class='group-timer'>
                <div class='icon-timer'/>
                <span>{formatTimer(ctrl.timer)}</span>
            </div>}
            {ctrl.isStarted &&
            (ctrl.question as IOpenResponseQuestion).subType === QuestionSubType.LIVE &&
            !ctrl.question.locked &&
            !ctrl.question.awarded &&
            ctrl.question.startTime &&
            !ctrl.timer &&
            <div class='group-timer'>
                LOCKED
            </div>}
            {isAwarded &&
            <div class='group-timer'>SCORED</div>}
            {ctrl.isStarted &&
                ctrl.question.type !== QuestionType.BANNER_IMAGE && !ctrl.gettingAnswerCount && <div class='answer-count'>
                <div>{typeof ctrl.answerCount === 'number' ? ctrl.answerCount : '---'}</div>
                <div>ANSWERED</div>
            </div>}
            {ctrl.isStarted && ctrl.question.type !== QuestionType.BANNER_IMAGE && ctrl.gettingAnswerCount && <div class='answer-count'>
                <div class='lds-ring'><div></div><div></div><div></div><div></div></div>
            </div>}
            {ctrl.isStarted && ctrl.question.type === QuestionType.BANNER_IMAGE && <div class='answer-count'></div>}

            <div class='btn button-edit'
                 onclick={ctrl.buttonEditHandler.bind(ctrl)}/>
            {!ctrl.isStarted &&
            <div class='btn group-arrows'>
                <div class='btn arrow-up'
                     onclick={ctrl.onmoveup.bind(ctrl, ctrl.question)}/>
                <div class='btn arrow-down'
                     onclick={ctrl.onmovedown.bind(ctrl, ctrl.question)}/>
            </div>}
            {!ctrl.isStarted &&
            <div class='btn button-remove'
                 onclick={ctrl.buttonRemoveHandler.bind(ctrl)}/>}
        </div>
    );
}
