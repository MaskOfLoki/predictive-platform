import { GameOverComponent } from './game-over.component';
import m from 'mithril';
import { StatsComponent } from '../../rank/stats/stats.component';
import { configService } from '../../../../services/config';
import { Feature } from '../../../../../../../common';

export function template(ctrl: GameOverComponent) {
    const leaderboardEnabled = configService.features[Feature.enableLeaderboard];
    return (
        <div class='game-over'>
            {configService.gameOverImage &&
                <div class='image'
                    style={{
                        backgroundImage: `url(${configService.gameOverImage.url})`,
                    }} />}
            <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                {configService.gameOverTitle}
            </div>
            <div class='subtitle'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                {configService.gameOverSubtitle}
            </div>
            {leaderboardEnabled && <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                YOUR STATS
            </div>}
            {leaderboardEnabled && <StatsComponent />}
            {leaderboardEnabled && <div class='title'
                style={{
                    color: configService.colors.text6,
                    ...configService.fontStyle,
                }}>
                TOP 3 LEADERBOARD
            </div>}
            {leaderboardEnabled && <div class='grid-leaders'>
                <div class='header'
                    style={{ backgroundColor: configService.colors.secondary }}>
                    <div class='cell'
                        style={{ color: configService.colors.text3 }}>
                        USERNAME
                    </div>
                    <div class='cell'
                        style={{ color: configService.colors.text3 }}>
                        POINTS
                    </div>
                </div>
                {ctrl.leaders.map((leader, index) =>
                    <div class='row'
                        style={{
                            animationDelay: `${0.1 * index}s`,
                            backgroundColor: index % 2 ? configService.colors.secondary : configService.colors.primary,
                            color: index % 2 ? configService.colors.text2 : configService.colors.text1,
                        }}>
                        <div class='cell'
                            style={{
                                color: leader.uid === ctrl.uid ?
                                    configService.colors.text5 : undefined,
                            }}>
                            {`${index + 1}. ${leader.username}`}
                        </div>
                        <div class='cell'
                            style={{
                                color: leader.uid === ctrl.uid ?
                                    configService.colors.text5 : undefined,
                            }}>
                            {leader.points}
                        </div>
                    </div>)}
            </div>}
        </div>
    );
}
