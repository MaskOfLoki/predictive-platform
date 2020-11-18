import m from 'mithril';
import {TeamSelectorComponent} from './team-selector.component';
import {getNumberSign} from '../../../../../../../../common';

export function template(ctrl: TeamSelectorComponent) {
    return (
        <div class={`gc-team-selector${ctrl.selected ? ' selected' : ''}`}
             onclick={ctrl.clickHandler.bind(ctrl)}>
            <span>
                {ctrl.team.name}
            </span>
            {ctrl.over &&
            <div class='spread'>
                {getNumberSign(ctrl.over) + ctrl.over}
            </div>}
            {ctrl.under &&
            <div class='spread'>
                {getNumberSign(ctrl.under) + ctrl.under}
            </div>}
            {ctrl.spread != null &&
            <div class='spread'>
                {getNumberSign(ctrl.spread) + ctrl.spread}
            </div>}
            <div class='odds'>
                {ctrl.team.odds}
            </div>
        </div>
    );
}
