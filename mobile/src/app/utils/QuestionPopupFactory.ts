import {QuestionType} from '../../../../common';
import {OpenResponseComponent} from '../components/main/play/popups/open-response/open-response.component';
import {MultiChoiceComponent} from '../components/main/play/popups/multi-choice/multi-choice.component';
import {BetMoneylineComponent} from '../components/main/play/popups/bet-moneyline/bet-moneyline.component';
import {BetPropComponent} from '../components/main/play/popups/bet-prop/bet-prop.component';

export class QuestionPopupFactory {
    public static get(questionType: QuestionType): any {
        switch (questionType) {
            case QuestionType.POLL_OPEN_RESPONSE:
            case QuestionType.QUESTION_OPEN_RESPONSE: {
                return OpenResponseComponent;
            }
            case QuestionType.QUESTION_MULTIPLE_CHOICE:
            case QuestionType.POLL_MULTIPLE_CHOICE: {
                return MultiChoiceComponent;
            }
            case QuestionType.BET_MONEYLINE:
            case QuestionType.BET_POINT_SPREAD:
            case QuestionType.BET_OVER_UNDER: {
                return BetMoneylineComponent;
            }
            case QuestionType.BET_PROP: {
                return BetPropComponent;
            }
        }
    }
}
