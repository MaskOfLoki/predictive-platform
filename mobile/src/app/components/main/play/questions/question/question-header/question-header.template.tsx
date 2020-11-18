import m from 'mithril';
import { QuestionHeaderComponent } from './question-header.component';
import { formatTimer, isPredictive, Feature, isPollQuestion } from '../../../../../../../../../common';
import { BadgeComponent } from '../badge/badge.component';
import { HelpButtonComponent } from './help-button/help-button.component';
import { configService } from '../../../../../../services/config';

export function template(ctrl: QuestionHeaderComponent) {
    const isPoll = isPollQuestion(ctrl.question);
    const showPoints = (isPoll && configService.features[Feature.displayPollPoints]) ||
        (!isPoll && configService.features[Feature.displayPredictivePoints]);
    const isRightBlock = (!ctrl.question.locked && !ctrl.question.awarded && ctrl.question.countdown) ||
        ctrl.question.pushed || (ctrl.question.awarded && ctrl.isCorrect != null && showPoints);

    return (
        <div class='gc-question-header'>
            <BadgeComponent question={ctrl.question}
                correct={ctrl.isCorrect} />
            {ctrl.hasHelp &&
                <HelpButtonComponent question={ctrl.question} />}
            <div class='label title' style={{ color: configService.colors.text4 }}>
                {ctrl.label}
                {!isPredictive(ctrl.question) && <br />}
                {isPredictive(ctrl.question) ? '' : ctrl.question.title}
            </div>
            {!ctrl.question.locked && !ctrl.question.awarded && ctrl.question.countdown &&
                <div class='group-timer'>
                    <div class='icon-timer' style={{ backgroundColor: configService.colors.text4 }} />
                    <span style={{ color: configService.colors.text4 }}>
                        {formatTimer(ctrl.question.countdown)}
                    </span>
                </div>}
            {!ctrl.question.pushed && ctrl.question.awarded && ctrl.isCorrect === false && ctrl.wager && showPoints &&
                <div class='label incorrect' style={{ color: configService.colors.incorrect }}>
                    <span>- {ctrl.wager}</span>
                    <div class='bucks'>POINTS</div>
                </div>}
            {ctrl.question.awarded && ctrl.isCorrect && !ctrl.question.pushed && showPoints &&
                <div class='label payout' style={{ color: configService.colors.correct }}>
                    <span>+ {ctrl.payout}</span>
                    <div class='bucks'>POINTS</div>
                </div>}
            {ctrl.question.awarded && ctrl.question.pushed && showPoints &&
                <div class='label pushed' style={{ color: configService.colors.pushed }}>
                    NO EARNINGS
            </div>}
            {/*if right block is missing add empty label to center question's title*/}
            {!isRightBlock && <div class='label empty' />}
        </div>
    );
}
