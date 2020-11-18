import m from 'mithril';
import {MarketingMessagePopupComponent} from './marketing-message-popup.component';
import {ToggleComponent} from '../../toggle/toggle.component';
import {TimerComponent} from '../../questions-panel/timer/timer.component';
import {MARKETING_MESSAGE_MAX_LENGTH} from '../../../../../../../common';

export function template(ctrl: MarketingMessagePopupComponent) {
    return (
        <div class='gc-marketing-message-popup'>
            <div class='header'>
                <div class='left'>
                    SAVE MARKETING MESSAGE
                </div>
                <div class='right'>
                    <div class='button' onclick={ctrl.buttonHelpHandler.bind(ctrl)}>?</div>
                    <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>X</div>
                </div>
            </div>
            <div class='content'>
                <div class='row'>
                    <div class='left'>
                        <ToggleComponent label='TEXT MESSAGE'
                                         type='radio'
                                         selected={!ctrl.isImage}
                                         onchange={() => ctrl.isImage = false}/>
                        <ToggleComponent label='PHOTO MESSAGE'
                                         type='radio'
                                         selected={ctrl.isImage}
                                         onchange={() => ctrl.isImage = true}/>
                    </div>
                    <div class='right'>
                        {!ctrl.isImage &&
                        <textarea class='gc-input'
                                  value={ctrl.text}
                                  oninput={e => ctrl.text = e.target.value}
                                  onkeypress={e => e.target.value.length < MARKETING_MESSAGE_MAX_LENGTH}
                                  placeholder='MESSAGE'/>}
                        {ctrl.isImage &&
                        <div class='image'
                             style={{
                                 backgroundImage: ctrl.photo ? `url(${ctrl.photo.url})` : '',
                             }}
                             onclick={ctrl.buttonPhotoHandler.bind(ctrl)}>
                            {ctrl.photo ? '' : 'PHOTO'}
                        </div>}
                    </div>
                </div>
                <div class='row'>
                    <TimerComponent value={ctrl.timer} onchange={value => ctrl.timer = value}/>
                    <div class='redirect-input'>
                        <div>Redirect URL (Empty for no redirect)</div>
                        <input class='gc-input'
                            value={ctrl.redirectUrl}
                            oninput={e => ctrl.redirectUrl = e.target.value}
                            placeholder='REDIRECT URL'/>
                    </div>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonSaveMessageHandler.bind(ctrl)}>
                    SAVE MESSAGE
                </div>
            </div>
        </div>
    );
}
