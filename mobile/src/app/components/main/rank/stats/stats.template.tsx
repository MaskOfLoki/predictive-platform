import { StatsComponent } from './stats.component';
import m from 'mithril';
import { humanize } from '../../../../utils';
import { configService } from '../../../../services/config';

export function template(ctrl: StatsComponent) {
    return (
        <div class='gc-stats'
            style={{
                backgroundColor: configService.colors.secondary,
                borderColor: configService.colors.primary,
                justifyContent: (!ctrl.correctAnswers && !ctrl.position) ? 'center' : 'space-between',
            }}>
            <div class='column'>
                <div class='row'>
                    <div class='icon-dollar' style={{ backgroundColor: configService.colors.primary }} />
                    <div class='label'
                        style={{ color: configService.colors.primary }}>
                        POINTS
                    </div>
                </div>
                <div class='line' style={{ backgroundColor: configService.colors.primary }} />
                <div class='value'
                    style={{ color: configService.colors.text4 }}>
                    {ctrl.bucks}
                </div>
            </div>
            {!!ctrl.position &&
                <div class='column'>
                    <div class='row'>
                        <div class='icon-rank' style={{ backgroundColor: configService.colors.primary }} />
                        <div class='label'
                            style={{ color: configService.colors.primary }}>
                            CURRENT RANK
                    </div>
                    </div>
                    <div class='line' style={{ backgroundColor: configService.colors.primary }} />
                    <div class='value'
                        style={{ color: configService.colors.text4 }}>
                        {humanize(ctrl.position).toUpperCase()}
                    </div>
                </div>}
            {ctrl.correctAnswers &&
                <div class='column'>
                    <div class='row'>
                        <div class='icon-checkmark' style={{ backgroundColor: configService.colors.primary }} />
                        <div class='label'
                            style={{ color: configService.colors.primary }}>
                            CORRECT ANSWERS
                    </div>
                    </div>
                    <div class='line' style={{ backgroundColor: configService.colors.primary }} />
                    <div class='value'
                        style={{ color: configService.colors.text4 }}>
                        {ctrl.correctAnswers}
                    </div>
                </div>}
        </div>
    );
}
