import m from 'mithril';
import { PollMultiChoiceAwardPopupComponent } from './poll-multi-choice-award-popup.component';
import { BadgeComponent } from '../../../badge/badge.component';
import { isXeo } from '../../../../../../utils';

export function template(ctrl: PollMultiChoiceAwardPopupComponent) {
  return (
    <div class='gc-poll-multi-choice-award-popup'>
      <div class='header'>
        <div class='left'>
          <BadgeComponent question={ctrl.question} />
          <span>POLL - MULTIPLE CHOICE</span>
        </div>
        <div class='right'>
          <div class='button' onclick={ctrl.buttonCloseHandler.bind(ctrl)}>
            X
          </div>
        </div>
      </div>
      <div class='content'>
        <div class='left'>
          <div class='question'>{ctrl.question.question}</div>
          <div class='responses'>{ctrl.statistics.total} RESPONSES</div>
          {ctrl.statistics.answers.map((answer) => (
            <div class='group-answer'>
              <div class='icon' style={{ background: answer.color }} />
              {answer.answer} - {answer.total}
            </div>
          ))}
        </div>
        <div class='line' />
        <div class='right'>
          {ctrl.statistics.answers.map((answer) => (
            <div
              class='group-answer'
              style={{
                width: `${
                  Math.floor(100 / ctrl.statistics.answers.length) - 1
                }%`,
              }}
            >
              {answer.answer}
              <div class='frame'>
                <div
                  class='background'
                  style={{
                    height: `${Math.round(
                      (100 * answer.total) / ctrl.statistics.total,
                    )}%`,
                    background: answer.color,
                  }}
                />
              </div>
              {answer.total}
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
