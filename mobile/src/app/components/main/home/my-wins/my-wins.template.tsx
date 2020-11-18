import m from 'mithril';
import { MyWinsComponent } from './my-wins.component';
import { configService } from '../../../../services/config';

export function template(ctrl: MyWinsComponent) {
    return (
        <div class='my-wins-screen'>
            <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                MY WINS
            </div>
            {ctrl.coupons.map(couponSet =>
                <div class='coupon-set'>
                    <div class='label'
                        style={{ color: configService.colors.text1 }}>
                        {couponSet.label}
                    </div>
                    {couponSet.coupons.map(coupon =>
                        <img src={coupon.coupon.image.url} />)}
                </div>)}
        </div>
    );
}
