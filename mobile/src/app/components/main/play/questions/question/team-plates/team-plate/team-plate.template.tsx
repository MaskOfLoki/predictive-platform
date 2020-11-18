import m from 'mithril';
import { TeamPlateComponent } from './team-plate.component';
import { getNumberWithSign } from '../../../../../../../../../../common';
import { configService } from '../../../../../../../services/config';

export function template(ctrl: TeamPlateComponent) {
    let classes = '';
    if (ctrl.selected) {
        if (typeof ctrl.isCorrect !== 'boolean') {
            classes = 'selected';
        } else if (!ctrl.pushed) {
            classes = (ctrl.isCorrect) ? 'correct' : 'wrong';
        } else {
            classes = 'pushed';
        }
    }

    let borderColor = configService.colors.primary;
    let backgroundColor = configService.colors.tertiary;
    if (ctrl.selected) {
        if (typeof ctrl.isCorrect !== 'boolean') {
        } else if (!ctrl.pushed) {
            borderColor = (ctrl.isCorrect) ? configService.colors.correct : configService.colors.incorrect;
        } else {
            borderColor = configService.colors.pushed;
        }
        backgroundColor = configService.colors.primary;
    }

    return (
        <div class={`gc-team-plate`}
            style={{ borderColor, backgroundColor, color: configService.colors.text4 }}
            onclick={() => ctrl.onclick(ctrl.team)}>
            <div class='marker' />
            <div class='name'>
                {ctrl.team.name}
            </div>
            <div class='row'>
                <div class='logo'
                    style={{ backgroundImage: `url(${ctrl.team.logo.url})` }} />
                <div class='column'>
                    {ctrl.spread != null &&
                        <div class='sub'>
                            {getNumberWithSign(ctrl.spread)}
                        </div>}
                    {ctrl.over &&
                        <div class='sub'>
                            OVER {ctrl.over}
                        </div>}
                    {ctrl.under &&
                        <div class='sub'>
                            UNDER {ctrl.under}
                        </div>}
                    <div class='odds'>
                        {getNumberWithSign(ctrl.team.odds)}
                    </div>
                </div>
            </div>
        </div>
    );
}
