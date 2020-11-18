import {PlayScreenComponent} from './play-screen.component';
import m from 'mithril';
import {LiveQuestionsComponent} from './live-questions/live-questions.component';
import {QuestionSetComponent} from './question-set/question-set.component';
import {GameOverComponent} from './game-over/game-over.component';
import {LockTimerComponent} from './lock-timer/lock-timer.component';

export function template(ctrl: PlayScreenComponent) {
    return (
        <div class='play-screen'>
          <LockTimerComponent config={ctrl.config}/>
          <GameOverComponent config={ctrl.config}/>
          <LiveQuestionsComponent config={ctrl.config}/>
          <QuestionSetComponent config={ctrl.config}/>
        </div>
    );
}
