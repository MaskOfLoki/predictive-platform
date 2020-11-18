import m from 'mithril';
import {MarketingMessageComponent} from './marketing-message.component';
import {isEmptyString} from '../../../../../../../common';

export function template(ctrl: MarketingMessageComponent) {
    return (
        <div class='gc-marketing-message'>
            {!isEmptyString(ctrl.message.text) &&
            <div class='text'>
                {ctrl.message.text}
            </div>}
            {ctrl.message.photo &&
            <div class='photo'
                 style={{
                     backgroundImage: `url(${ctrl.message.photo.url})`,
                 }}/>}
            <div class='buttons'>
                <div class='button-edit'
                     onclick={ctrl.onedit.bind(ctrl, ctrl.message)}/>
                <div class='button-remove'
                     onclick={ctrl.ondelete.bind(ctrl, ctrl.message)}/>
            </div>
        </div>
    );
}
