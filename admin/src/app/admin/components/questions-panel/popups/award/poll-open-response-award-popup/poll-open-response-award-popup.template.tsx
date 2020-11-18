import m from 'mithril';
import { PollOpenResponseAwardPopupComponent } from './poll-open-response-award-popup.component';
import { BadgeComponent } from '../../../badge/badge.component';
import { isXeo } from '../../../../../../utils';

export function template(ctrl: PollOpenResponseAwardPopupComponent) {
  return (
    <div class='gc-poll-open-response-award-popup'>
      <div class='header'>
        <div class='left'>
          <BadgeComponent question={ctrl.question} />
          <span>POLL - OPEN RESPONSE</span>
        </div>
        <div class='right'>
          <div class='button' onclick={ctrl.buttonCloseHandler.bind(ctrl)}>
            X
          </div>
        </div>
      </div>
      <div class='content'>
        <div class='question'>{ctrl.question.question}</div>
        <div class='responses'>{ctrl.statistics.total} RESPONSES</div>
        <div class='line' />
        <div class='group-answers'>
          {ctrl.statistics.answers.map((answer) => (
            <div class='group-answer'>
              <div class='icon' style={{ background: answer.color }} />
              {answer.answer} - {answer.total}
            </div>
          ))}
        </div>
      </div>
      <div class='buttons'>
        {!isXeo() && (
          <div class='button' onclick={ctrl.buttonShareHandler.bind(ctrl)}>
            SHARE TO MAINBOARD
          </div>
        )}
      </div>
    </div>
  );
}
