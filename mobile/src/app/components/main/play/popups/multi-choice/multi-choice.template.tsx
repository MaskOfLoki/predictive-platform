import { MultiChoiceComponent } from './multi-choice.component';
import m from 'mithril';
import { Feature, formatTimer, isEmptyString, isPollQuestion } from '../../../../../../../../common';
import { configService } from '../../../../../services/config';

export function template(ctrl: MultiChoiceComponent) {
    const isPoll = isPollQuestion(ctrl.question);
    const showPoints = (isPoll && configService.features[Feature.displayPollPoints]) ||
        (!isPoll && configService.features[Feature.displayPredictivePoints]);
    const isSubmitDisabled = ctrl.value == null || isEmptyString(ctrl.value) || ctrl.question.locked;
    return (
        <div class='gc-multi-choice-popup'
            style={{
                backgroundColor: configService.colors.secondary,
                borderColor: configService.colors.primary,
            }}>
            <div class='button-close'
                style={{
                    backgroundColor: configService.colors.primary,
                    color: configService.colors.text1,
                }}
                onclick={ctrl.buttonCloseHandler.bind(ctrl)}>
                X
            </div>
            <div class='group-header' style={{ color: configService.colors.text4 }}>
                <span>
                    {ctrl.question.title}
                </span>
                {ctrl.question.countdown > 0 && !ctrl.question.locked &&
                    <div class='group-timer'>
                        <div class='icon-timer' style={{ backgroundColor: configService.colors.text4 }} />
                        <span>{formatTimer(ctrl.question.countdown)}</span>
                    </div>}
            </div>
            <div class='question'
                style={{ color: configService.colors.text4 }}>
                {ctrl.question.question}
            </div>
            {showPoints && <div class='instruction'
                style={{ color: configService.colors.text4 }}>
                Answer now{isPoll ? '' : ' for a chance'} to earn bonus points!
            </div>}
            <div class='scroller'>
                {ctrl.question.answers.map(answer =>
                    <div class='gc-answer'
                        style={{
                            background: ctrl.value === answer ? configService.colors.primary : 'none',
                            color: configService.colors.text4,
                            borderColor: configService.colors.text4,
                        }}
                        onclick={() => ctrl.value = answer}>
                        <span>{answer}</span>
                        {configService.features[Feature.inlinePollResults] &&
                            <span>{ctrl.getAnswerAmount(answer)}</span>}
                    </div>)}
            </div>
            {showPoints && <div class='label-points'
                style={{ color: configService.colors.text4 }}>
                {ctrl.payout} POINTS
            </div>}
            <div class={`gc-button${isSubmitDisabled ? ' disabled' : ''}`}
                onclick={ctrl.buttonSubmitHandler.bind(ctrl)}>
                {ctrl.question.locked ? 'LOCKED' : 'SUBMIT'}
            </div>
        </div>
    );
}
