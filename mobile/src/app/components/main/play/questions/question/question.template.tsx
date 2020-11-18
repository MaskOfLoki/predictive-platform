import { QuestionComponent } from './question.component';
import m from 'mithril';
import { TeamPlatesComponent } from './team-plates/team-plates.component';
import { AnswerInputComponent } from '../../popups/answer-input/answer-input.component';
import { PredictiveStatsComponent } from './predicitive-stats/predictive-stats.component';
import { QuestionHeaderComponent } from './question-header/question-header.component';
import { getColor } from '../../../../../utils';
import { IBannerQuestion, isMultiChoiceQuestion, QuestionType } from '../../../../../../../../common';
import { configService } from '../../../../../services/config';

export function template(ctrl: QuestionComponent) {
    if (ctrl.question.type !== QuestionType.BANNER_IMAGE) {
        return (
            <div class='gc-question'
                style={{
                    borderColor: getColor(ctrl.question, ctrl.isCorrect, configService.colors),
                    backgroundColor: configService.colors.secondary,
                }}
                onclick={ctrl.clickHandler.bind(ctrl)}>
                <QuestionHeaderComponent question={ctrl.question}
                    correct={ctrl.isCorrect}
                    label={ctrl.label}
                    payout={ctrl.answer ? ctrl.answer.payout : null}
                    wager={ctrl.answer ? ctrl.answer.wager : null} />
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
                {ctrl.isPredictive && isMultiChoiceQuestion(ctrl.question) &&
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
                        subtitle={`PAYOUT: ${ctrl.answer && ctrl.answer.payout ?
                            ctrl.answer.payout - (ctrl.answer.wager || 0) :
                            ctrl.question['points']}`} />}
            </div>
        );
    } else {
        const question = ctrl.question as IBannerQuestion;
        return (
            <img class='gc-question banner-image'
                onclick={ctrl.onClick.bind(ctrl)}
                src={question.banner.url} />
        );
    }
}
