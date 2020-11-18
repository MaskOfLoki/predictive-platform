import {ClassComponent, Vnode} from 'mithril';
import {template} from './questions-list-header.template';
import './questions-list-header.component.scss';
import {api} from '../../../services/api';
import {PopupManager} from '../../../utils/PopupManager';
import {AlertPopupComponent} from '../../alert-popup/alert-popup.component';
import {progressService} from '../../../services/ProgressService';

interface IQuestionsListHeaderAttrs {
    onchange: (tab: QuestionPanelTab) => void;
}

export class QuestionsListHeaderComponent implements ClassComponent<IQuestionsListHeaderAttrs> {
    private _selectedTab = QuestionPanelTab.DEFAULT;
    private _onchange: (tab: QuestionPanelTab) => void;

    public oninit(vnode: Vnode<IQuestionsListHeaderAttrs, this>) {
        this._onchange = vnode.attrs.onchange;
    }

    public tabHandler(tab: QuestionPanelTab) {
        this._selectedTab = tab;
        this._onchange(this._selectedTab);
    }

    public async buttonClearPrizeHoldersHandler() {
        const result = await PopupManager.show(AlertPopupComponent, {
            // tslint:disable-next-line
            text: 'This will reset all user\'s points back to ZERO and clear any data currently stored for leaderboards and prizes',
        });

        if (!result) {
            return;
        }

        const progressCallback = progressService.start('Clearing...');
        const completeHandler = () => progressCallback({
            current: 1,
            total: 1,
        });
        api.resetPrizeHolders().then(completeHandler, completeHandler);
        this.tabHandler(QuestionPanelTab.DEFAULT);
    }

    public view() {
        return template(this);
    }

    public get selectedTab(): QuestionPanelTab {
        return this._selectedTab;
    }
}

export enum QuestionPanelTab {
    DEFAULT,
    LIVE,
    PRIZE_HOLDERS,
}
