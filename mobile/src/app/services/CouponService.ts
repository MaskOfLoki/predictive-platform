import {api} from './api';
import {PopupManager} from '../utils/PopupManager';
import {CouponPopupComponent} from '../components/coupon-popup/coupon-popup.component';
import {IGCAwardedCoupon} from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

export class CouponService {
    public start() {
        api.coupon.add(this.couponHandler.bind(this));
    }

    private couponHandler(coupon: IGCAwardedCoupon) {
        return PopupManager.show(CouponPopupComponent, {
            coupon,
        });
    }
}
