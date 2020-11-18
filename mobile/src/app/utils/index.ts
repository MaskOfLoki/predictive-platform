import {
  IQuestion,
  QuestionSubType,
  QuestionType,
  isBetQuestion,
  isPollQuestion,
  IQuestionSet,
  ScheduleType,
  IOpenResponseQuestion,
  IBetMoneylineQuestion,
  IBetPropQuestion,
  IQuestionAnswer,
  IColors,
} from '../../../../common';

export function humanize(value: number): string {
  if (value == null) {
    return '';
  }

  if (value % 100 >= 11 && value % 100 <= 13) {
    return value + 'th';
  }

  switch (value % 10) {
    case 1:
      return value + 'st';
    case 2:
      return value + 'nd';
    case 3:
      return value + 'rd';
  }

  return value + 'th';
}

const labels = {
  [QuestionType.POLL_OPEN_RESPONSE]: 'POLL',
  [QuestionType.POLL_MULTIPLE_CHOICE]: 'POLL',
  [QuestionType.BET_OVER_UNDER]: 'BET',
  [QuestionType.BET_PROP]: 'BET',
  [QuestionType.BET_POINT_SPREAD]: 'BET',
  [QuestionType.BET_MONEYLINE]: 'BET',
};

const subLabels = {
  [QuestionSubType.PREDICTIVE]: 'PREDICTIVE',
  [QuestionSubType.TRIVIA]: 'TRIVIA',
  [QuestionSubType.LIVE]: 'LIVE',
};

export function getQuestionName(question: IQuestion): string {
  if (question['subType'] != null) {
    return subLabels[question['subType']];
  } else {
    return labels[question.type];
  }
}

const params: URLSearchParams = new URLSearchParams(location.search);

export function getQueryParam(name: string): string {
  return params.get(name);
}

export function isXeo(): boolean {
  return params.has('xeo');
}

export function getColor(
  question: IQuestion,
  isCorrect: boolean,
  colors: IColors,
): string {
  if (!question.awarded && !question.locked) {
    return colors.primary;
  } else if (!question.awarded && question.locked && isCorrect === null) {
    return colors.pending;
  } else if (question.awarded && question.pushed) {
    return colors.pushed;
  } else if (isCorrect) {
    return colors.correct;
  } else {
    return colors.incorrect;
  }
}

export function getLabel(question: IQuestion, isCorrect: boolean) {
  if (!question.awarded && !question.locked) {
    return isBetQuestion(question) ? 'BET NOW!' : 'ANSWER NOW!';
  } else if (!question.awarded && question.locked) {
    return isBetQuestion(question) ? 'PENDING' : 'LOCKED';
  } else if (question.awarded && question.pushed) {
    return 'PUSHED';
  } else if (isCorrect) {
    return isPollQuestion(question) ? 'SCORED' : 'CORRECT';
  } else {
    return 'INCORRECT';
  }
}

export function getActiveQuestionSets(values: IQuestionSet[]): IQuestionSet[] {
  return values.filter((set) => {
    switch (set.scheduleType) {
      case ScheduleType.COUNTDOWN:
      case ScheduleType.MANUAL:
        return !!set.startedTime;
      case ScheduleType.RANGE:
        return set.startTime < new Date();
    }
  });
}

export function getActiveLiveQuestions(values: IQuestionSet[]): IQuestion[] {
  const result: IQuestion[] = [];

  values.forEach((questionSet) =>
    questionSet.questions.forEach((question: IOpenResponseQuestion) => {
      if (question.subType === QuestionSubType.LIVE && question.startTime) {
        result.push(question);
      }
    }),
  );

  return result;
}

export function isCorrect(
  question: IQuestion,
  answer: IQuestionAnswer,
): boolean {
  if (answer && question.awarded) {
    switch (question.type) {
      case QuestionType.BET_MONEYLINE:
      case QuestionType.BET_OVER_UNDER:
      case QuestionType.BET_POINT_SPREAD:
        return (question as IBetMoneylineQuestion).winner === answer.team;
      case QuestionType.BET_PROP:
        const q = question as IBetPropQuestion;
        return (
          q.outcomes.findIndex((outcome) => outcome.text === answer.answer) ===
          q.correctAnswer
        );
      case QuestionType.QUESTION_MULTIPLE_CHOICE:
      case QuestionType.QUESTION_OPEN_RESPONSE:
        return (
          (question as IOpenResponseQuestion).correctAnswer === answer.answer
        );
      case QuestionType.POLL_MULTIPLE_CHOICE:
      case QuestionType.POLL_OPEN_RESPONSE:
        return true;
      default:
        return false;
    }
  }

  return null;
}

export function getIOSVersion(): number {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    const v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(v[1], 10);
    // return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(String(v[3] || 0), 10)];
  }
}
