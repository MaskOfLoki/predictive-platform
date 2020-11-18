import m from 'mithril';
import {UserRowComponent} from './user-row.component';
import {formatPhone} from '../../../../../../utils';
import {CouponStatus} from '../../../../../../../../../../common';

export function template(ctrl: UserRowComponent) {
    return ctrl.user && (
        <div class={`gc-user-row${ctrl.selected ? ' selected' : ''}`}
             onclick={ctrl.clickHandler.bind(ctrl)}>
            <div class='cell place'>
                <input type='checkbox'
                       checked={ctrl.selected}/>
                {ctrl.user.position}
            </div>
            <div class='cell'>
                {ctrl.user.username}
            </div>
            <div class='cell points'>
                {ctrl.user.points}
            </div>
            <div class='cell'>
                {ctrl.user.phone && formatPhone(ctrl.user.phone)}
            </div>
            <div class='cell'>
                {ctrl.user.email}
            </div>
            <div class='cell coupon'
                 style={{color: getCouponStatusColor(ctrl.user.couponStatus)}}>
                {ctrl.user.couponStatus}
            </div>
        </div>
    );
}

function getCouponStatusColor(value: CouponStatus): string {
    if (value === CouponStatus.NOT_SENT) {
        return 'red';
    } else if (value === CouponStatus.SENT) {
        return 'white';
    } else {
        return '#00B21B';
    }
}
