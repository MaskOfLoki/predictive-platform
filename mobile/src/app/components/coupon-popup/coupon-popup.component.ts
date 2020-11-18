import {ClassComponent, Vnode} from 'mithril';
import {template} from './coupon-popup.template';
import './coupon-popup.component.scss';
import * as MiniSignal from 'mini-signals';
import {PopupManager} from '../../utils/PopupManager';
import {DataCapturePopupComponent} from '../data-capture-popup/data-capture-popup.component';
import {isEmptyString} from '@gamechangerinteractive/gc-firebase/utils';
import {IGCAwardedCoupon} from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

interface ICouponPopupAttrs {
    closePopup: MiniSignal;
    coupon: IGCAwardedCoupon;
}

export class CouponPopupComponent implements ClassComponent<ICouponPopupAttrs> {
    private _closePopup: MiniSignal;
    private _coupon: IGCAwardedCoupon;

    public async oninit(vnode: Vnode<ICouponPopupAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._coupon = vnode.attrs.coupon;

        if (this._coupon.coupon.dataCapture) {
            const accepted = await PopupManager.show(DataCapturePopupComponent, {
                coupon: this._coupon,
            });

            if (!accepted) {
                this._closePopup.dispatch();
            }
        }
    }

    public clickHandler() {
        if (!isEmptyString(this._coupon.coupon.redirectUrl)) {
            window.open(this._coupon.coupon.redirectUrl, '_blank');
        }
    }

    public buttonCloseHandler(event: Event) {
        event.stopImmediatePropagation();
        this._closePopup.dispatch();
    }

    public view() {
        return template(this);
    }

    public get coupon() {
        return this._coupon;
    }
}
