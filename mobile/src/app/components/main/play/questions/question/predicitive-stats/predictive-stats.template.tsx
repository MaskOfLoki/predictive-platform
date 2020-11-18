import m from 'mithril';
import { IAnswerInfo, PredictiveStatsComponent } from './predictive-stats.component';
import { configService } from '../../../../../../services/config';
import { getColor } from '../../../../../../utils';
import { Feature } from '../../../../../../../../../common';


export function template(ctrl: PredictiveStatsComponent) {
    const answer = ctrl.answer;
    const showAnswerAmount = configService.features[Feature.displayPredictivePoints];
    return (
        <div class='gc-predictive-stats'>
            {ctrl.statistics.answers.map(item =>
                <div class={getStatItemClass(item)}
                    style={{
                        backgroundColor: configService.colors.primary,
                        borderColor: ctrl.question.awarded && answer && ctrl.question.correctAnswer === item.answer ?
                            getColor(ctrl.question, answer.answer === item.answer, configService.colors) :
                            configService.colors.text4,
                    }}
                    onclick={ctrl.clickHandler.bind(ctrl, item)}>
                    <div class='answer' style={{ color: configService.colors.text4 }}>
                        {item.answer}
                    </div>
                    <div class='stats'>
                        <div class='fill'
                            style={{ width: `${item.percentage}%` }} />
                        <div class='percentage' style={{ color: configService.colors.text4 }}>{item.percentage}%</div>
                        {showAnswerAmount && <div class='bucks' style={{ color: configService.colors.text4 }}>
                            {(answer && answer.answer === item.answer) ? answer.payout : item.bucks} POINTS
                        </div>}
                    </div>
                    <div class='icon' />
                </div>)}
        </div>
    );
}

function getStatItemClass(item: IAnswerInfo): string {
    let result = 'stat-item';

    if (item.isCorrect) {
        result += ' correct';
    } else if (item.isCurrentUserAnswer) {
        result += item.isCorrect === false ? ' incorrect' : ' current-user';
    }

    return result;
}
