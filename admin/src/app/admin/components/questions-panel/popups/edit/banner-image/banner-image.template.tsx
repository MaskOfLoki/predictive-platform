import m from 'mithril';
import {BannerImagePopupComponent} from './banner-image.component';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';
import {isEmptyString} from '../../../../../../../../../common';

export function template(ctrl: BannerImagePopupComponent) {
    return (
        <div class='gc-banner-image-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}
                                     help='Image size can push questions down on screen, requiring scrolling.<br/><br/>High definition images can slow down loading times for mobile users'/>
            <div class='content'>
                <div class='gc-button'
                     onclick={ctrl.buttonChangeHandler.bind(ctrl)}>
                    CHANGE
                </div>
                <div class='banner-display' style={{
                    backgroundImage: isEmptyString(ctrl.url) ? '' : `url(${ctrl.url})`,
                }}/>
                <div class='redirect-input'>
                    <div>Redirect URL (Empty for no redirect)</div>
                    <input class='gc-input'
                           value={ctrl.redirectUrl}
                           oninput={e => ctrl.redirectUrl = e.target.value}
                           placeholder='REDIRECT URL'/>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE QUESTION
                </div>
            </div>
        </div>
    );
}
