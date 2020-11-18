import m from 'mithril';
import {CouponNotificationPopupComponent} from './coupon-notification-popup.component';

export function template(ctrl: CouponNotificationPopupComponent) {
    return (
        <div class='gc-coupon-notification-popup'>
            <div class='button-close'
                 onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X</div>
            <div class='title'>
                CONGRATULATIONS!
            </div>
            <div class='message'>
                You've won!
                <br/>
                Check your SMS for instructions on how to claim your prize.
            </div>
        </div>
    );
}
