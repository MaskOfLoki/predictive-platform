import m from 'mithril';
import { RankScreenComponent } from './rank-screen.component';
import { StatsComponent } from '../stats/stats.component';
import { MarketingMessageComponent } from '../marketing-message/marketing-message.component';

export function template(ctrl: RankScreenComponent) {
  return (
    <div class='rank-screen'>
      <MarketingMessageComponent config={ctrl.config} />
      <div
        class='title'
        style={{
          color: ctrl.config.colors.text6,
          ...ctrl.fontStyle,
        }}
      >
        YOUR STATS
      </div>
      <StatsComponent config={ctrl.config} />
      <div
        class='title'
        style={{
          color: ctrl.config.colors.text6,
          ...ctrl.fontStyle,
        }}
      >
        LEADERBOARD
      </div>
      <div
        class='grid-leaders'
        style={{ borderColor: ctrl.config.colors.primary }}
      >
        <div class='group-tabs'>
          {!ctrl.config.disabledSetLeaderboard && (
            <div
              class='cell'
              style={{
                color: ctrl.config.colors.text3,
              }}
            >
              SET
            </div>
          )}
          {!ctrl.config.disabledDailyLeaderboard && (
            <div
              class='cell'
              style={{
                color: ctrl.config.colors.text3,
              }}
            >
              DAILY
            </div>
          )}
          <div
            class='cell'
            style={{
              color: ctrl.config.colors.text3,
              borderBottom: `${ctrl.config.colors.primary} solid 2px`,
            }}
          >
            OVERALL
          </div>
        </div>
        <div
          class='leaderboard-header'
          style={{
            backgroundColor: ctrl.config.colors.secondary,
            color: ctrl.config.colors.text3,
          }}
        >
          <div class='cell'>USERNAME</div>
          <div class='cell'>POINTS</div>
        </div>
        <div class='group-rows'>
          {ctrl.leaders.map((leader, index) => (
            <div
              class={
                index % 2 ? 'leaderboard-row' : 'leaderboard-row alternate'
              }
              style={{
                animationDelay: `${0.1 * index}s`,
                backgroundColor:
                  index % 2
                    ? ctrl.config.colors.secondary
                    : ctrl.config.colors.primary,
                color:
                  index % 2
                    ? ctrl.config.colors.text2
                    : ctrl.config.colors.text1,
              }}
            >
              <div
                class='cell'
                style={{
                  color:
                    leader.uid === ctrl.uid
                      ? ctrl.config.colors.text5
                      : undefined,
                }}
              >
                {`${leader.position}. ${leader.username}`}
              </div>
              <div
                class='cell'
                style={{
                  color:
                    leader.uid === ctrl.uid
                      ? ctrl.config.colors.text5
                      : undefined,
                }}
              >
                {leader.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
