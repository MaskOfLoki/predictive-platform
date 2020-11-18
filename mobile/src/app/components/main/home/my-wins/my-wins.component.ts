import {template} from './my-wins.template';
import './my-wins.component.scss';
import m from 'mithril';
import {api} from '../../../../services/api';
import {BaseComponent} from '../../../../utils/BaseComponent';
import {IGCAwardedCoupon} from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

export class MyWinsComponent extends BaseComponent {
    private readonly _couponSets: ICouponSet[] = [];

    public async oninit() {
        const coupons = await api.getCoupons();
        coupons.sort((c1, c2) => c2.time.getTime() - c1.time.getTime());

        coupons.forEach(coupon => {
            // tslint:disable-next-line
            const label = `${(coupon.time.getMonth() + 1).toString().padStart(2, '0')} / ${coupon.time.getDate().toString().padStart(2, '0')} / ${coupon.time.getFullYear()}`;

            let couponSet = this._couponSets.find(item => item.label === label);

            if (!couponSet) {
                couponSet = {
                    label,
                    coupons: [],
                };

                this._couponSets.push(couponSet);
            }

            couponSet.coupons.push(coupon);
        });

        m.redraw();
    }

    public view() {
        return template(this);
    }

    public get coupons(): ICouponSet[] {
        return this._couponSets;
    }
}

interface ICouponSet {
    label: string;
    coupons: IGCAwardedCoupon[];
}
