import { BetMoneylineComponent } from './bet-moneyline.component';
import m from 'mithril';
import { TeamPlatesComponent } from '../../questions/question/team-plates/team-plates.component';
import { formatTimer } from '../../../../../../../../common';
import { AnswerInputComponent } from '../answer-input/answer-input.component';
import { configService } from '../../../../../services/config';

export function template(ctrl: BetMoneylineComponent) {
    const isSubmitDisabled = ctrl.value == null ||
        isNaN(ctrl.value) ||
        ctrl.payout === 0 ||
        ctrl.question.locked;
    return (
        <div class='gc-bet-moneyline-popup'
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
                        <span>{formatTimer(ctrl.question.countdown)}</span>
                    </div>}
            </div>
            <TeamPlatesComponent teamA={ctrl.question.teamA}
                teamB={ctrl.question.teamB}
                readonly={ctrl.isReadOnly}
                selectedTeam={ctrl.selectedTeam}
                onchange={ctrl.teamSelectionHandler.bind(ctrl)} />
            {ctrl.selectedTeam &&
                <AnswerInputComponent question={ctrl.question}
                    value={ctrl.value}
                    readonly={ctrl.isReadOnly}
                    onchange={ctrl.inputHandler.bind(ctrl)}
                    subtitle={ctrl.payout ? `PAYOUT: ${ctrl.payout - ctrl.value}` : ''} />}
            {ctrl.isReadOnly === false &&
                <div class={`gc-button${isSubmitDisabled ? ' disabled' : ''}`}
                    onclick={ctrl.buttonSubmitHandler.bind(ctrl)}>
                    {ctrl.question.locked ? 'LOCKED' : 'PLACE BET'}
                </div>}
        </div>
    );
}
