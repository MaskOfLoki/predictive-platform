import {ClassComponent, Vnode} from 'mithril';
import {template} from './coupon-notification-popup.template';
import './coupon-notification-popup.component.scss';
import * as MiniSignal from 'mini-signals';

interface ICouponPopupAttrs {
    closePopup: MiniSignal;
}

export class CouponNotificationPopupComponent implements ClassComponent<ICouponPopupAttrs> {
    private _closePopup: MiniSignal;

    public oninit(vnode: Vnode<ICouponPopupAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
    }

    public buttonCloseHandler() {
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }
}
