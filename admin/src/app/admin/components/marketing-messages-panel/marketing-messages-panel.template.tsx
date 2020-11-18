import m from 'mithril';
import {MarketingMessagesPanelComponent} from './marketing-messages-panel.component';
import {MarketingMessageComponent} from './marketing-message/marketing-message.component';

export function template(ctrl: MarketingMessagesPanelComponent) {
    return (
        <div class='gc-marketing-messages-panel'>
            <div class='title'>
                MARKETING MESSAGES
            </div>
            {ctrl.event &&
            <div class='scroller'>
                {ctrl.event.marketingMessages.map(message =>
                    <MarketingMessageComponent message={message}
                                               onedit={ctrl.messageEditHandler.bind(ctrl)}
                                               ondelete={ctrl.messageRemoveHandler.bind(ctrl)}/>)}
            </div>}
            {ctrl.event &&
            <div class='button-add-message'
                 onclick={ctrl.buttonNewMessageHandler.bind(ctrl)}>
                ADD NEW MESSAGE
            </div>}
        </div>
    );
}
