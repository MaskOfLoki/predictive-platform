import m from 'mithril';
import { AnswerInputComponent } from './answer-input.component';
import {
  isEmptyString,
  QuestionType,
  isPollQuestion,
  Feature,
  IBetPropQuestion,
} from '../../../../../../../../common';
import { getColor } from '../../../../../utils';
import { configService } from '../../../../../services/config';

export function template(ctrl: AnswerInputComponent) {
  const color = getColor(ctrl.question, ctrl.isCorrect, configService.colors);
  let result = '';
  const isPoll = isPollQuestion(ctrl.question);
  const isPredictiveOpenResponse = ctrl.question.type === QuestionType.QUESTION_OPEN_RESPONSE;
  const showPoints =
    (isPoll && configService.features[Feature.displayPollPoints]) ||
    (!isPoll && configService.features[Feature.displayPredictivePoints]);

  if (ctrl.question.awarded && !ctrl.question.pushed) {
    switch (ctrl.isCorrect) {
      case null:
        result = 'missed';
        break;
      case true:
        result = 'correct';
        break;
      case false:
        result = 'wrong';
        break;
    }
  }

  let classes = 'gc-answer-input';
  classes += ctrl.question.awarded ? ' awarded' : '';
  classes += (isPredictiveOpenResponse) ? ' bet-open-response' : '';
  classes += (isPoll) ? ' poll' : '';

  return (
    <div class={`${classes}`}>
      {ctrl.answer && (isPoll || isPredictiveOpenResponse) && (
        <div class='user-answers' style={{color: color}}>
          <div class='selected-answer'>
            Your Choice: {ctrl.answer.answer}
          </div>
          {isPredictiveOpenResponse && (
            <div class='correct-answer'>
              Correct Answer: {(ctrl.question as IBetPropQuestion).correctAnswer}
            </div>
          )}
        </div>
      )}
      {!ctrl.question.awarded && (
        <div class='group-input'>
          <input
            class='gc-input'
            style={{
              backgroundColor: configService.colors.secondary,
              color: configService.colors.text4,
            }}
            type={
              ctrl.question.type === QuestionType.POLL_OPEN_RESPONSE
                ? 'number'
                : 'text'
            }
            readonly={ctrl.readonly}
            value={ctrl.value}
            oninput={ctrl.inputHandler.bind(ctrl)}
            onchange={ctrl.changeHandler.bind(ctrl)}
            onkeypress={(e) => e.target.value.length < ctrl.maxlength}
          />
          {!isEmptyString(ctrl.subtitle) && (
            <div
              class='label-subtitle'
              style={{ color: configService.colors.text4 }}
            >
              {ctrl.subtitle}
            </div>
          )}
        </div>
      )}
      {ctrl.question.awarded && (
        <div
          class={`award-result ${result}`}
          style={`border-color: ${color}; background-color: ${color}`}
        >
          <div>
            {ctrl.isCorrect === null && !ctrl.question.pushed && (
              <span class='award'>MISSED</span>
            )}
            {ctrl.isCorrect && !ctrl.question.pushed && !showPoints && (
              <span>
                <span
                  class='award'
                  style={{ color: configService.colors.text4 }}
                >
                  {isPollQuestion(ctrl.question) ? 'THANK YOU' : 'GOOD JOB'}
                </span>
              </span>
            )}
            {ctrl.isCorrect && !ctrl.question.pushed && showPoints && (
              <span>
                <span
                  class='award'
                  style={{ color: configService.colors.text4 }}
                >
                  +
                  {ctrl.answer.payout -
                    (ctrl.answer.wager ? ctrl.answer.wager : 0)}
                  &nbsp;
                </span>
                <span style={{ color: configService.colors.text4 }}>
                  POINTS
                </span>
              </span>
            )}
            {ctrl.isCorrect === false &&
              !ctrl.question.pushed &&
              ctrl.answer.wager &&
              showPoints && (
                <span>
                  <span
                    class='award'
                    style={{ color: configService.colors.text4 }}
                  >
                    -{ctrl.answer.wager}{' '}
                  </span>
                  <span style={{ color: configService.colors.text4 }}>
                    POINTS
                  </span>
                </span>
              )}
            {ctrl.isCorrect === false &&
              !ctrl.question.pushed &&
              !ctrl.answer.wager &&
              showPoints && (
                <span
                  class='award'
                  style={{ color: configService.colors.text4 }}
                >
                  INCORRECT
                </span>
              )}

            {ctrl.isCorrect === false && !ctrl.question.pushed && !showPoints && (
              <span>
                <span
                  class='award'
                  style={{ color: configService.colors.text4 }}
                >
                  MAYBE NEXT TIME
                </span>
              </span>
            )}
            {ctrl.question.pushed && showPoints && (
              <span class='award' style={{ color: configService.colors.text4 }}>
                NO EARNINGS
              </span>
            )}
            {ctrl.question.pushed && !showPoints && (
              <span class='award' style={{ color: configService.colors.text4 }}>
                MAYBE NEXT TIME
              </span>
            )}
          </div>
          {!isEmptyString(ctrl.subtitle) && ctrl.isOpenResponse && (
            <div class='label-subtitle'>{ctrl.subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}
