import m from 'mithril';
import {AlertPopupComponent} from './alert-popup.component';

export function template(ctrl: AlertPopupComponent) {
    return (
        <div class='gc-alert-popup'>
            <div class='title'>{ctrl.title}</div>
            <div class='content'>
                <label>{ctrl.text}</label>
                {ctrl.input && <input type={ctrl.input} placeholder={ctrl.inputPlaceholder}/>}
            </div>
            <div class='buttons' style={{justifyContent: ctrl.hideCancelButton ? 'center' : 'space-between'}}>
                {!ctrl.hideCancelButton && <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>}
                {!ctrl.hideCancelButton && <div class='line'/>}
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    {ctrl.buttonConfirmText}
                </div>
            </div>
        </div>
    );
}
