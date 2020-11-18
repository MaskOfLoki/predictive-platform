import m from 'mithril';
import {AlertPopupComponent} from './alert-popup.component';

export function template(ctrl: AlertPopupComponent) {
    return (
        <div class='gc-alert-popup'>
            <div class='title'>{ctrl.title}</div>
            <div class='content'>
                <label innerHTML={ctrl.text}/>
                {ctrl.input &&
                <input type={ctrl.input}
                       value={ctrl.inputValue}
                       oninput={e => ctrl.inputValue = e.target.value}
                       placeholder={ctrl.inputPlaceholder}/>}
            </div>
            <div class='buttons' style={{justifyContent: ctrl.hideCancelButton ? 'center' : 'space-between'}}>
                {!ctrl.hideCancelButton &&
                <div class='button'
                     onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>}
                {!ctrl.hideCancelButton && <div class='line'/>}
                <div class='button'
                     onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    {ctrl.buttonConfirmText}
                </div>
            </div>
        </div>
    );
}
