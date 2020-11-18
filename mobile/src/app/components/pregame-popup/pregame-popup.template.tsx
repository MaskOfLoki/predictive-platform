import m from 'mithril';
import {PregamePopupComponent} from './pregame-popup.component';

export function template(ctrl: PregamePopupComponent) {
    let style = '';

    if (ctrl.popup) {
        style = `background-image: url('${ctrl.popup.url}');`;
    }

    return (
        <div class='popup-screen'>
            {ctrl.popup &&
            <div class='popup-container'>
                <div class='popup' style={style}/>
                <div class='gc-button' onclick={ctrl.buttonClickHandler.bind(ctrl)}>CONTINUE</div>
            </div>}
        </div>
    );
}
