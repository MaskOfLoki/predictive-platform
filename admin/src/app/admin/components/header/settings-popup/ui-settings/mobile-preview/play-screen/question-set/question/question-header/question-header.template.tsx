import m from 'mithril';
import {QuestionHeaderComponent} from './question-header.component';
import {formatTimer} from '../../../../../../../../../../../../../common';
import {BadgeComponent} from './badge/badge.component';

export function template(ctrl: QuestionHeaderComponent) {
  return (
    <div class='gc-mobile-question-header'>
      <BadgeComponent config={ctrl.config}/>
      <div class='label title' style={{color: ctrl.config.colors.text4}}>
          QUESTION 1/1
      </div>
      <div class='group-timer'>
        <div class='icon-timer' style={{backgroundColor: ctrl.config.colors.text4}}/>
        <span style={{color: ctrl.config.colors.text4}}>
            {formatTimer(ctrl.countdown)}
        </span>
      </div>
    </div>
  );
}
