import m from 'mithril';
import {CouponPopupComponent} from './coupon-popup.component';

export function template(ctrl: CouponPopupComponent) {
    return (
        <div class='gc-coupon-popup'>
            <div class='button-close'
                 onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
            </div>
            <div class='image'
                 onclick={ctrl.clickHandler.bind(ctrl)}
                 style={{backgroundImage: `url(${ctrl.coupon.coupon.image.url})`}}/>
        </div>
    );
}
