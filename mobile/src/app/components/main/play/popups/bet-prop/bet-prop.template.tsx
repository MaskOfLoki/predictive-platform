import { BetPropComponent } from './bet-prop.component';
import m from 'mithril';
import { formatTimer, getNumberSign } from '../../../../../../../../common';
import { AnswerInputComponent } from '../answer-input/answer-input.component';
import { configService } from '../../../../../services/config';

export function template(ctrl: BetPropComponent) {
    const isSubmitDisabled = ctrl.value == null || isNaN(ctrl.value) || ctrl.payout === 0 || ctrl.question.locked;
    return (
        <div class='gc-bet-prop-popup'
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
                {ctrl.question.countdown && !ctrl.question.locked &&
                    <div class='group-timer'>
                        <div class='icon-timer' style={{ backgroundColor: configService.colors.text4 }} />
                        <span style={{ color: configService.colors.text4 }}>{formatTimer(ctrl.question.countdown)}</span>
                    </div>}
            </div>
            <div class='question'
                style={{ color: configService.colors.text4 }}>
                {ctrl.propQuestion.description}
            </div>
            <div class='scroller'>
                {ctrl.propQuestion.outcomes.map(answer =>
                    <div class={`gc-answer${ctrl.isReadOnly ? ' disabled' : ''}`}
                        style={{
                            background: ctrl.selectedAnswer === answer.text ? configService.colors.primary : 'none',
                            color: configService.colors.text4,
                            borderColor: configService.colors.primary,
                        }}
                        onclick={() => ctrl.selectedAnswer = answer.text}>
                        {answer.text}
                        <div class='odds'>
                            {`${getNumberSign(answer.odds)}${answer.odds}`}
                        </div>
                    </div>)}
            </div>
            <AnswerInputComponent question={ctrl.question}
                value={ctrl.value}
                readonly={ctrl.isReadOnly}
                onchange={ctrl.inputHandler.bind(ctrl)}
                subtitle={ctrl.payout ? `PAYOUT: ${ctrl.payout - ctrl.value}` : ''} />
            {ctrl.isReadOnly === false &&
                <div class={`gc-button${isSubmitDisabled ? ' disabled' : ''}`}
                    onclick={ctrl.buttonSubmitHandler.bind(ctrl)}>
                    {ctrl.question.locked ? 'LOCKED' : 'PLACE BET'}
                </div>}
        </div>
    );
}
