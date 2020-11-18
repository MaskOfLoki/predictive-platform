import m from 'mithril';
import {PrizeHolderComponent} from './prize-holder.component';
import {PrizeHolderType} from '../prize-holders.component';
import {formatPhone} from '../../../../utils';

export function template(ctrl: PrizeHolderComponent) {
    return ctrl.prizeHolder && (
        <div class='gc-prize-holder'
             onclick={ctrl.clickHandler.bind(ctrl)}>
            <div class={getBadgeClass(ctrl.type)}>
                {getBadgeTitle(ctrl.type)}
                {ctrl.name &&
                <div class='subtitle'>
                    {ctrl.name}
                </div>}
            </div>
            <div class='username'>
                {ctrl.prizeHolder.username}
            </div>
            <div class='points'>
                {ctrl.prizeHolder.points} points
            </div>
            <div class='phone'>
                {formatPhone(ctrl.prizeHolder.phone)}
            </div>
            {ctrl.prizeHolder.email &&
            <div class='email'>
                {ctrl.prizeHolder.email}
            </div>}
            <div class='gc-button'
            onclick={ctrl.buttonRemoveHandler.bind(ctrl)}>
                X
            </div>
        </div>
    );
}

function getBadgeTitle(type: PrizeHolderType): string {
    if (type === PrizeHolderType.OVERALL) {
        return 'OVERALL';
    } else if (type === PrizeHolderType.EVENT) {
        return 'EVENT';
    } else {
        return 'SET';
    }
}

function getBadgeClass(type: PrizeHolderType): string {
    let result = 'badge';

    if (type === PrizeHolderType.OVERALL) {
        result += ' overall';
    } else if (type === PrizeHolderType.EVENT) {
        result += ' event';
    } else {
        result += ' set';
    }

    return result;
}
