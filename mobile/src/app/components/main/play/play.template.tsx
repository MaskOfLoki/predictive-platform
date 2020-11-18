import {PlayComponent} from './play.component';
import m from 'mithril';
import {LiveQuestionsComponent} from './live-questions/live-questions.component';
import {QuestionSetsComponent} from './question-sets/question-sets.component';
import {GameOverComponent} from './game-over/game-over.component';
import {LockTimerComponent} from './lock-timer/lock-timer.component';
import {MarketingMessageComponent} from '../marketing-message/marketing-message.component';

export function template(ctrl: PlayComponent) {
    return (
        <div class='play-screen'>
            {!ctrl.isStarted && <GameOverComponent/>}
            {ctrl.isStarted && ctrl.showLockTimer &&
            <LockTimerComponent/>}
            {ctrl.isStarted && <MarketingMessageComponent/>}
            {ctrl.isStarted && <LiveQuestionsComponent/>}
            {ctrl.isStarted && <QuestionSetsComponent/>}
        </div>
    );
}
