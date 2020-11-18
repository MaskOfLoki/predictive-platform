import m from 'mithril';
import {MessageComponent, MessageType} from './message.component';
import {isEmptyString} from '../../../../../../../../../common';

export function template(ctrl: MessageComponent) {
    return (
        <div class='gc-message-popup'>
            <div class='header'>
                <div class='left'>
                    {ctrl.type === MessageType.PHONE ? 'TEXT MESSAGE' : 'EMAIL'}
                </div>
                <div class='right'>
                    <div class='button'
                         onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
                    </div>
                </div>
            </div>
            <div class='content'>
                <div class='label'>
                    RECIPIENTS: {ctrl.recipients.length}
                </div>
                {ctrl.type === MessageType.EMAIL &&
                <div class='label'>
                    SUBJECT:
                    <input
                        type='text'
                        class='gc-input'
                        value={ctrl.subject}
                        oninput={e => ctrl.subject = e.target.value}/>
                </div>}
                {ctrl.type === MessageType.EMAIL &&
                <div class='group-image'>
                    <span>IMAGE: </span>
                    {!isEmptyString(ctrl.image) &&
                    <div class='image'
                         style={{
                             backgroundImage: `url(${ctrl.image})`,
                         }}/>}
                    <div class='gc-button'
                         onclick={ctrl.buttonAttachImageHandler.bind(ctrl)}>
                        {isEmptyString(ctrl.image) ? 'ATTACH' : 'REMOVE'}
                    </div>
                </div>}
                <div class='label'>
                    MESSAGE
                </div>
                <textarea class='gc-input'
                          value={ctrl.text}
                          oninput={e => ctrl.text = e.target.value}
                          onkeypress={e => ctrl.type === 'email' || e.target.value.length < 140}/>
            </div>
            <div class='buttons'>
                <div class='button'
                     onclick={() => {
                         if (ctrl.type === MessageType.PHONE) {
                             ctrl.buttonSendHandler();
                         } else {
                             ctrl.buttonSendEmailHandler();
                         }
                     }}>
                    SEND
                </div>
            </div>
        </div>
    );
}
