import m from 'mithril';
import {QuestionPanelTab, QuestionsListHeaderComponent} from './questions-list-header.component';

export function template(ctrl: QuestionsListHeaderComponent) {
    return (
        <div class='gc-questions-list-header'>
            <div class='title'>CURRENT QUESTIONS</div>
            <div class={`gc-tab${ctrl.selectedTab === QuestionPanelTab.DEFAULT ? ' active' : ''}`}
                 onclick={ctrl.tabHandler.bind(ctrl, QuestionPanelTab.DEFAULT)}>
                DEFAULT
            </div>
            <div class={`gc-tab${ctrl.selectedTab === QuestionPanelTab.LIVE ? ' active' : ''}`}
                 onclick={ctrl.tabHandler.bind(ctrl, QuestionPanelTab.LIVE)}>
                LIVE
            </div>
            <div class={`gc-tab${ctrl.selectedTab === QuestionPanelTab.PRIZE_HOLDERS ? ' active' : ''}`}
                 onclick={ctrl.tabHandler.bind(ctrl, QuestionPanelTab.PRIZE_HOLDERS)}>
                PRIZE HOLDERS
            </div>
            {ctrl.selectedTab === QuestionPanelTab.PRIZE_HOLDERS &&
            <div class='gc-button'
                 onclick={ctrl.buttonClearPrizeHoldersHandler.bind(ctrl)}>
                CLEAR
            </div>}
        </div>
    );
}
