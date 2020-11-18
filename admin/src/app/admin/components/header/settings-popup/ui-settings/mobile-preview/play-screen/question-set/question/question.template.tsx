import {QuestionComponent} from './question.component';
import m from 'mithril';
import {PredictiveStatsComponent} from './predictive-stats/predictive-stats.component';
import {QuestionHeaderComponent} from './question-header/question-header.component';

export function template(ctrl: QuestionComponent) {
  return (
    <div class='gc-mobile-question'
      style={{
          borderColor: ctrl.config.colors.primary,
          backgroundColor: ctrl.config.colors.secondary,
      }}>
      <QuestionHeaderComponent config={ctrl.config}/>
      <div class='text'
        style={{color: ctrl.config.colors.text4}}>
        QUESTION TITLE
      </div>
      <div class='subheader'
        style={{color: ctrl.config.colors.text4}}>
        QUESTION SUBHEADER
      </div>
      <PredictiveStatsComponent config={ctrl.config}/>
    </div>
  );
}
