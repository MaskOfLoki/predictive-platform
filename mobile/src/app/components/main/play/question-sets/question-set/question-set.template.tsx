import { QuestionSetComponent } from './question-set.component';
import m from 'mithril';
import { QuestionsComponent } from '../../questions/questions.component';
import { formatTimer, ScheduleType } from '../../../../../../../../common';
import { configService } from '../../../../../services/config';

export function template(ctrl: QuestionSetComponent) {
    const showInProgressMessage = (ctrl.countdown > 0) ||
        (ctrl.questionSet.scheduleType === ScheduleType.MANUAL &&
            !ctrl.locked && ctrl.questionSet.progressMessage);

    const showCompletedMessage = ctrl.questionSet.completeMessage &&
        (ctrl.countdown < 1 || ctrl.locked);

    if (ctrl.isHide) {
        return (<div></div>);
    } else {
        return ctrl.questionSet && (
            <div class='gc-question-set'>
                <div class='header' onclick={() => ctrl.isOpen = !ctrl.isOpen}
                    style={{ backgroundColor: configService.colors.primary }}>
                    <div class={`arrow${ctrl.isOpen ? ' open' : ''}`}
                        style={{ backgroundColor: configService.colors.text4 }} />
                    <div class='title' style={{ color: configService.colors.text4 }}>
                        {ctrl.questionSet.name}
                    </div>
                    <div class='spacer' />
                    {showInProgressMessage &&
                        <div class='group-timer'>
                            {!ctrl.questionSet.progressMessage &&
                                <div class='icon-timer' style={{ backgroundColor: configService.colors.text4 }} />}
                            {!ctrl.questionSet.progressMessage && <span style={{ color: configService.colors.text4 }}>
                                {formatTimer(ctrl.countdown)}
                            </span>}
                            {ctrl.questionSet.progressMessage && <span style={{ color: configService.colors.text4 }}>
                                {ctrl.questionSet.progressMessage}
                            </span>}
                        </div>}
                    {showCompletedMessage &&
                        <div class='group-timer'>
                            <span style={{ color: configService.colors.text4 }}>
                                {ctrl.questionSet.completeMessage}
                            </span>
                        </div>}
                </div>
                {ctrl.isOpen &&
                    <QuestionsComponent questions={ctrl.questionSet.questions}
                        locked={ctrl.locked} />}
            </div>
        );
    }
}
