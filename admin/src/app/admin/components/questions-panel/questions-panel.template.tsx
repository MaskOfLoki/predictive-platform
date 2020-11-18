import m from 'mithril';
import {QuestionsPanelComponent} from './questions-panel.component';
import {SelectorsComponent} from './selectors/selectors.component';
import {QuestionPanelTab, QuestionsListHeaderComponent} from './questions-list-header/questions-list-header.component';
import {QuestionsListComponent} from './questions-list/questions-list.component';
import {PrizeHoldersComponent} from './prize-holders/prize-holders.component';

export function template(ctrl: QuestionsPanelComponent) {
    return (
        <div class='gc-questions-panel'>
            <SelectorsComponent onchange={ctrl.eventChangeHandler.bind(ctrl)}/>
            <QuestionsListHeaderComponent onchange={ctrl.tabChangeHandler.bind(ctrl)}/>
            {ctrl.selectedTab !== QuestionPanelTab.PRIZE_HOLDERS &&
            <QuestionsListComponent questions={ctrl.questionSets}
                                    isLive={ctrl.selectedTab === QuestionPanelTab.LIVE}
                                    onedit={ctrl.questionEditHandler.bind(ctrl)}
                                    ondelete={ctrl.questionRemoveHandler.bind(ctrl)}
                                    onmakelive={ctrl.makeLiveHandler.bind(ctrl)}
                                    onmoveup={ctrl.moveQuestionUpHandler.bind(ctrl)}
                                    onmovedown={ctrl.moveQuestionDownHandler.bind(ctrl)}
                                    onsetmoveup={ctrl.moveSetUpHandler.bind(ctrl)}
                                    onsetmovedown={ctrl.moveSetDownHandler.bind(ctrl)}
                                    onsaveevent={ctrl.saveEventHandler.bind(ctrl)}/>}
            {ctrl.selectedTab === QuestionPanelTab.PRIZE_HOLDERS &&
            <PrizeHoldersComponent/>}
        </div>
    );
}
