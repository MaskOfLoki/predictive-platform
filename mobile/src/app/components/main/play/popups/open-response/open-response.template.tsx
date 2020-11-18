import { OpenResponseComponent } from './open-response.component';
import m from 'mithril';
import { formatTimer, isEmptyString, isPollQuestion, Feature } from '../../../../../../../../common';
import { AnswerInputComponent } from '../answer-input/answer-input.component';
import { configService } from '../../../../../services/config';

export function template(ctrl: OpenResponseComponent) {
    const isSubmitDisabled = ctrl.value == null || isEmptyString(ctrl.value) || ctrl.question.locked;
    const isPoll = isPollQuestion(ctrl.question);
    const showPoints = (isPoll && configService.features[Feature.displayPollPoints]) ||
        (!isPoll && configService.features[Feature.displayPredictivePoints]);

    return (
        <div class='gc-open-response-popup'
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
                        <div class='icon-timer'
                            style={{ backgroundColor: configService.colors.text4 }} />
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
            {isPoll &&
                <div class='instruction'
                    style={{ color: configService.colors.text4 }}>
                    Only numeric values are accepted
            </div>}
            <AnswerInputComponent question={ctrl.question}
                value={ctrl.value}
                onchange={value => ctrl.value = value}
                subtitle={`${ctrl.payout} POINTS`} />
            <div class={`gc-button${isSubmitDisabled ? ' disabled' : ''}`}
                onclick={ctrl.buttonSubmitHandler.bind(ctrl)}>
                {ctrl.question.locked ? 'LOCKED' : 'SUBMIT'}
            </div>
        </div>
    );
}
