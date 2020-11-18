import cx from 'classnames';
import m from 'mithril';

import {
  formatTimer,
  IOpenResponseQuestion,
  QuestionSubType,
  ScheduleType,
} from '../../../../../../../../common';
import { BadgeComponent } from '../../badge/badge.component';
import { QuestionComponent } from '../question/question.component';
import { QuestionSetComponent } from './question-set.component';

export function template(ctrl: QuestionSetComponent) {
  const dateOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };

  return (
    <div class='gc-question-set'>
      <div class='gc-question-set-header'>
        <BadgeComponent
          color='#707070'
          label='SET'
          onclick={() => (ctrl.isOpen = !ctrl.isOpen)}
        />
        <div class={cx('arrow', { open: ctrl.isOpen })} />
        <div class='label'>{ctrl.questionSet.name}</div>
        {!ctrl.isLive &&
          ctrl.questionSet.scheduleType === ScheduleType.COUNTDOWN && (
            <div class='info countdown'>
              <div class={cx('timer', { active: ctrl.isStarted })}>
                {formatTimer(
                  ctrl.isStarted
                    ? ctrl.questionSet.startedTime
                      ? ctrl.currentTimer
                      : ctrl.questionSet.countdown
                    : ctrl.questionSet.countdown,
                )}
              </div>
              <div class={cx('controls', { active: ctrl.isStarted })}>
                <button
                  class={cx('toggle-countdown', {
                    started: ctrl.questionSet.started,
                  })}
                  onclick={ctrl.buttonToggleStartHandler.bind(ctrl)}
                >
                  START COUNTDOWN
                </button>
                {ctrl.isStarted && (
                  <button
                    class='toggle-countdown'
                    onclick={ctrl.buttonAddMoreTimeHandler.bind(ctrl)}
                  >
                    ADD MORE TIME
                  </button>
                )}
                {ctrl.isStarted && (
                  <button
                    class='toggle-countdown'
                    onclick={ctrl.buttonGetAnswerCounts.bind(ctrl)}
                  >
                    GET ANSWER COUNTS
                  </button>
                )}
              </div>
            </div>
          )}
        {!ctrl.isLive && ctrl.questionSet.scheduleType === ScheduleType.RANGE && (
          <div class='info date-range'>
            <div class='date-range'>
              {ctrl.questionSet.startTime.toLocaleDateString(
                'en-US',
                dateOptions,
              )}
              &nbsp;-&nbsp;
              {ctrl.questionSet.endTime.toLocaleDateString(
                'en-US',
                dateOptions,
              )}
            </div>
            <div class={cx('controls', { active: ctrl.isStarted })}>
              {ctrl.isStarted && (
                <button
                  class='toggle-countdown'
                  onclick={ctrl.buttonGetAnswerCounts.bind(ctrl)}
                >
                  GET ANSWER COUNTS
                </button>
              )}
            </div>
          </div>
        )}
        {!ctrl.isLive &&
          ctrl.questionSet.scheduleType === ScheduleType.MANUAL &&
          ctrl.isStarted && (
            <div class='info manual'>
              <div class='timer'>{formatTimer(ctrl.currentTimer)}</div>
              <div class='controls'>
                <button
                  class={cx('start', {
                    disabled: !!ctrl.questionSet.startedTime,
                  })}
                  onclick={ctrl.buttonToggleStartHandler.bind(ctrl)}
                >
                  START
                </button>
                <button
                  class={cx('stop', { disabled: !ctrl.questionSet.started })}
                  onclick={ctrl.buttonToggleStartHandler.bind(ctrl)}
                >
                  STOP
                </button>
              </div>
              {ctrl.isStarted && (
                <button
                  class='toggle-countdown answers'
                  onclick={ctrl.buttonGetAnswerCounts.bind(ctrl)}
                >
                  GET ANSWER COUNTS
                </button>
              )}
            </div>
          )}
        {!ctrl.isStarted && !ctrl.isLive && (
          <div class='group-arrows'>
            <div
              class='arrow-up'
              onclick={ctrl.onsetmoveup.bind(ctrl, ctrl.questionSet)}
            />
            <div
              class='arrow-down'
              onclick={ctrl.onsetmovedown.bind(ctrl, ctrl.questionSet)}
            />
          </div>
        )}
      </div>
      {ctrl.isOpen && (
        <div class='group-questions'>
          {ctrl.questionSet.questions
            .filter((question) => {
              if (ctrl.isLive) {
                return (
                  (question as IOpenResponseQuestion).subType ===
                  QuestionSubType.LIVE
                );
              } else {
                return (
                  (question as IOpenResponseQuestion).subType !==
                  QuestionSubType.LIVE
                );
              }
            })
            .map((question) => (
              <QuestionComponent
                question={question}
                active={ctrl.isActive}
                onedit={ctrl.buttonEditHandler.bind(ctrl)}
                ondelete={ctrl.buttonRemoveHandler.bind(ctrl)}
                onmakelive={ctrl.onmakelive}
                onmoveup={ctrl.onmoveup}
                onmovedown={ctrl.onmovedown}
                answercountsignal={ctrl.answerCountSignal}
              />
            ))}
        </div>
      )}
    </div>
  );
}
