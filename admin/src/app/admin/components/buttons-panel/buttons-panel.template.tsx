import m from 'mithril';
import {ButtonsPanelComponent} from './buttons-panel.component';

export function template(ctrl: ButtonsPanelComponent) {
    return (
        <div class='gc-buttons-panel'>
            <button class={`button ${ctrl.isStarted ? 'stop' : 'start'}`}
                 onclick={ctrl.buttonEventHandler.bind(ctrl)}>
                {`${ctrl.isStarted ? 'STOP' : 'START'} EVENT`}
            </button>
            {/*<div class='button coupons'
                 onclick={ctrl.buttonCouponsHandler.bind(ctrl)}>
                COUPONS
            </div>*/}
        </div>
    );
}
