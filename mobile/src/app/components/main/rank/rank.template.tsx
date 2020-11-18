import { RankComponent } from './rank.component';
import m from 'mithril';
import { StatsComponent } from './stats/stats.component';
import { MarketingMessageComponent } from '../marketing-message/marketing-message.component';
import { configService } from '../../../services/config';
import { LeaderboardType } from '../../../../../../common';
import cx from 'classnames';

export function template(ctrl: RankComponent) {
    return (
        <div class='rank-screen'>
            <MarketingMessageComponent />
            <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                YOUR STATS
            </div>
            <StatsComponent />
            <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                LEADERBOARD
            </div>
            <div class='grid-leaders'
                style={{ borderColor: configService.colors.primary }}>
                <div class='group-tabs'
                    style={{
                        backgroundColor: configService.colors.tertiary,
                    }}>
                    {!configService.disabledSetLeaderboard &&
                        <div class='cell'
                            style={{
                                color: configService.colors.text3,
                                borderBottom: ctrl.selectedLeaderboardType === LeaderboardType.SET ?
                                    `${configService.colors.primary} solid 1vw` : undefined,
                            }}
                            onclick={() => ctrl.leaderboardTypeChangeHandler(LeaderboardType.SET)}>
                            SET
                    </div>}
                    {!configService.disabledDailyLeaderboard &&
                        <div class='cell'
                            style={{
                                color: configService.colors.text3,
                                borderBottom: ctrl.selectedLeaderboardType === LeaderboardType.DAILY ?
                                    `${configService.colors.primary} solid 1vw` : undefined,
                            }}
                            onclick={() => ctrl.leaderboardTypeChangeHandler(LeaderboardType.DAILY)}>
                            EVENT
                    </div>}
                    <div class='cell'
                        style={{
                            color: configService.colors.text3,
                            borderBottom: ctrl.selectedLeaderboardType === LeaderboardType.OVERALL ?
                                `${configService.colors.primary} solid 1vw` : undefined,
                        }}
                        onclick={() => ctrl.leaderboardTypeChangeHandler(LeaderboardType.OVERALL)}>
                        OVERALL
                    </div>
                </div>
                <div class='header'
                    style={{
                        backgroundColor: configService.colors.secondary,
                        color: configService.colors.text3,
                    }}>
                    <div class='cell'>USERNAME</div>
                    <div class='cell'>POINTS</div>
                </div>
                <div class='group-rows'>
                    {ctrl.leaders.map((leader, index) =>
                        <div class={cx('row', { alternate: index % 2 })}
                            style={{
                                animationDelay: `${0.1 * index}s`,
                                backgroundColor: index % 2 ?
                                    configService.colors.secondary : configService.colors.primary,
                                color: index % 2 ? configService.colors.text2 : configService.colors.text1,
                            }}>
                            <div class='cell'
                                style={{
                                    color: leader.uid === ctrl.uid ?
                                        configService.colors.text5 : undefined,
                                }}>
                                {`${leader.position}. ${leader.username}`}
                            </div>
                            <div class='cell'
                                style={{
                                    color: leader.uid === ctrl.uid ?
                                        configService.colors.text5 : undefined,
                                }}>
                                {leader.points}
                            </div>
                        </div>)}
                </div>
            </div>
        </div>
    );
}
