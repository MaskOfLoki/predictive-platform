import { LiveQuestionComponent } from './live-question.component';
import m from 'mithril';
import { QuestionHeaderComponent } from '../../questions/question/question-header/question-header.component';
import { configService } from '../../../../../services/config';
import { isMultiChoiceQuestion } from '../../../../../../../../common';
import { PredictiveStatsComponent } from '../../questions/question/predicitive-stats/predictive-stats.component';
import { AnswerInputComponent } from '../../popups/answer-input/answer-input.component';
import { TeamPlatesComponent } from '../../questions/question/team-plates/team-plates.component';

export function template(ctrl: LiveQuestionComponent) {
    const buttonDisabled = !!ctrl.answer || ctrl.question.countdown === 0;
    let buttonLabel: string;

    if (ctrl.question.countdown === 0) {
        buttonLabel = 'ANSWER LOCKED';
    } else if (ctrl.answer) {
        buttonLabel = 'ANSWERED';
    } else {
        buttonLabel = 'TAP TO ANSWER';
    }

    return (
        <div class='gc-live-question'
            style={{
                backgroundColor: configService.colors.secondary,
                borderColor: configService.colors.primary,
            }}
            onclick={ctrl.clickHandler.bind(ctrl)}>
            <QuestionHeaderComponent question={ctrl.question}
                correct={ctrl.isCorrect}
                label='LIVE QUESTION'
                payout={ctrl.answer ? ctrl.answer.payout : null} />
            {ctrl.text &&
                <div class='text'
                    style={{ color: configService.colors.text4 }}>
                    {ctrl.text}
                </div>}
            {ctrl.subheader &&
                <div class='subheader'
                    style={{ color: configService.colors.text4 }}>
                    {ctrl.subheader}
                </div>}
            {ctrl.hasTeams &&
                <TeamPlatesComponent teamA={ctrl.teamA}
                    teamB={ctrl.teamB}
                    pushed={ctrl.question.pushed}
                    selectedTeam={ctrl.selectedTeam}
                    correct={ctrl.isCorrect}
                    readonly='true' />}
            {isMultiChoiceQuestion(ctrl.question) &&
                <PredictiveStatsComponent question={ctrl.question}
                    answer={ctrl.answer}
                    answers={ctrl.answers} />}
            {(((ctrl.answer || ctrl.question.awarded) && !isMultiChoiceQuestion(ctrl.question)) ||
                (ctrl.question.awarded && isMultiChoiceQuestion(ctrl.question))) &&
                <AnswerInputComponent question={ctrl.question}
                    readonly='true'
                    value={ctrl.answerValue}
                    correct={ctrl.isCorrect}
                    answer={ctrl.answer}
                    average={ctrl.average}
                    // tslint:disable-next-line: max-line-length
                    subtitle={`PAYOUT: ${ctrl.answer && ctrl.answer.payout ? ctrl.answer.payout - (ctrl.answer.wager || 0) : ctrl.question['points']}`} />}
        </div>
    );
}
