import {QuestionType} from '../../../../../common';

const betMoneylineHelp = require('./bet-moneyline.md');
const betPointSpreadHelp = require('./bet-point-spread.md');
const betOverUnderHelp = require('./bet-over-under.md');
const betPropHelp = require('./bet-prop.md');

const helps: Map<QuestionType, string> = new Map<QuestionType, string>();

helps.set(QuestionType.BET_MONEYLINE, betMoneylineHelp);
helps.set(QuestionType.BET_POINT_SPREAD, betPointSpreadHelp);
helps.set(QuestionType.BET_OVER_UNDER, betOverUnderHelp);
helps.set(QuestionType.BET_PROP, betPropHelp);

export function getQuestionHelp(type: QuestionType): string {
    return helps.get(type);
}
