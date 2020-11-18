import {QuestionType} from '../../../../../common';
import {BetMoneylineAwardPopupComponent,
} from '../components/questions-panel/popups/award/bet-moneyline-award-popup/bet-moneyline-award-popup.component';
import {BetMoneylinePopupComponent,
} from '../components/questions-panel/popups/edit/bet-moneyline-popup/bet-moneyline-popup.component';
import {BetPointSpreadPopupComponent,
} from '../components/questions-panel/popups/edit/bet-point-spread-popup/bet-point-spread-popup.component';
import {BetOverUnderPopupComponent,
} from '../components/questions-panel/popups/edit/bet-over-under-popup/bet-over-under-popup.component';
import {BetPropAwardPopupComponent,
} from '../components/questions-panel/popups/award/bet-prop-award-popup/bet-prop-award-popup.component';
import {BetPropPopupComponent,
} from '../components/questions-panel/popups/edit/bet-prop-popup/bet-prop-popup.component';
import {QuestionOpenResponsePopupComponent,
} from '../components/questions-panel/popups/edit/question-open-response-popup/question-open-response-popup.component';
import {QuestionMultipleChoicePopupComponent,
// tslint:disable-next-line
} from '../components/questions-panel/popups/edit/question-multiple-choice-popup/question-multiple-choice-popup.component';
import {PollOpenResponsePopupComponent,
} from '../components/questions-panel/popups/edit/poll-open-response-popup/poll-open-response-popup.component';
import {PollMultipleChoicePopupComponent,
} from '../components/questions-panel/popups/edit/poll-multiple-choice-popup/poll-multiple-choice-popup.component';
import {MultiChoiceAwardPopupComponent,
} from '../components/questions-panel/popups/award/multi-choice-award-popup/multi-choice-award-popup.component';
import {OpenResponseAwardPopupComponent,
} from '../components/questions-panel/popups/award/open-response-award-popup/open-response-award-popup.component';
import {PollOpenResponseAwardPopupComponent,
    // tslint:disable-next-line
} from '../components/questions-panel/popups/award/poll-open-response-award-popup/poll-open-response-award-popup.component';
import {PollMultiChoiceAwardPopupComponent,
    // tslint:disable-next-line
} from '../components/questions-panel/popups/award/poll-multi-choice-award-popup/poll-multi-choice-award-popup.component';
// tslint:disable-next-line
import { BannerImagePopupComponent } from '../components/questions-panel/popups/edit/banner-image/banner-image.component';

export class QuestionPopupFactory {
    public static get(questionType: QuestionType, award?: boolean): any {
        switch (questionType) {
            case QuestionType.BET_MONEYLINE:
                return award ? BetMoneylineAwardPopupComponent : BetMoneylinePopupComponent;
            case QuestionType.BET_POINT_SPREAD:
                return award ? BetMoneylineAwardPopupComponent : BetPointSpreadPopupComponent;
            case QuestionType.BET_OVER_UNDER:
                return award ? BetMoneylineAwardPopupComponent : BetOverUnderPopupComponent;
            case QuestionType.BET_PROP:
                return award ? BetPropAwardPopupComponent : BetPropPopupComponent;
            case QuestionType.QUESTION_OPEN_RESPONSE:
                return award ? OpenResponseAwardPopupComponent : QuestionOpenResponsePopupComponent;
            case QuestionType.QUESTION_MULTIPLE_CHOICE:
                return award ? MultiChoiceAwardPopupComponent : QuestionMultipleChoicePopupComponent;
            case QuestionType.POLL_OPEN_RESPONSE:
                return award ? PollOpenResponseAwardPopupComponent : PollOpenResponsePopupComponent;
            case QuestionType.POLL_MULTIPLE_CHOICE:
                return award ? PollMultiChoiceAwardPopupComponent : PollMultipleChoicePopupComponent;
            case QuestionType.BANNER_IMAGE:
                return award ? null : BannerImagePopupComponent;
        }

        return null;
    }
}
