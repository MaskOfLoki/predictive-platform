import m from 'mithril';
import {AdminComponent} from './admin.component';
import {HeaderComponent} from './components/header/header.component';
import {QuestionsPanelComponent} from './components/questions-panel/questions-panel.component';
import {ButtonsPanelComponent} from './components/buttons-panel/buttons-panel.component';
import {
    MarketingMessagesPanelComponent,
} from './components/marketing-messages-panel/marketing-messages-panel.component';

export function template(ctrl: AdminComponent) {
    return (
        <div class='admin-screen'>
            <HeaderComponent/>
            <div class='row'>
                <QuestionsPanelComponent onEventChange={value => ctrl.event = value}/>
                <div class='column'>
                    <MarketingMessagesPanelComponent event={ctrl.event}/>
                    <ButtonsPanelComponent event={ctrl.event}/>
                </div>
            </div>
        </div>
    );
}
