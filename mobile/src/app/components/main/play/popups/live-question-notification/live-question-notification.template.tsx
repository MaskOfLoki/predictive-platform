import m from 'mithril';
import { LiveQuestionNotificationComponent } from './live-question-notification.component';
import { QuestionHeaderComponent } from '../../questions/question/question-header/question-header.component';
import { configService } from '../../../../../services/config';

export function template(ctrl: LiveQuestionNotificationComponent) {
    return (
        <div class='live-question-notification-popup' style={{
            backgroundColor: configService.colors.secondary,
            borderColor: configService.colors.primary,
            color: configService.colors.text4,
        }}>
            <QuestionHeaderComponent question={ctrl.question}
                label='LIVE QUESTION' />
            <div class='title'>
                You have a live question you can answer for extra points!
            </div>
            <div class='group-buttons'>
                <div class='gc-button dismiss'
                    style={{
                        backgroundColor: configService.colors.incorrect,
                        color: configService.colors.text4,
                    }}
                    onclick={ctrl.buttonDismissHandler.bind(ctrl)}>
                    DISMISS
                </div>
                <div class='gc-button'
                    style={{
                        backgroundColor: configService.colors.correct,
                        color: configService.colors.text4,
                    }}
                    onclick={ctrl.buttonAnswerHandler.bind(ctrl)}>
                    ANSWER
                </div>
            </div>
        </div>
    );
}
