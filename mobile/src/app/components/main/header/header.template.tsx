import { HeaderComponent } from './header.component';
import m from 'mithril';
import { humanize } from '../../../utils';
import { configService } from '../../../services/config';
import { Feature } from '../../../../../../common';

export function template(ctrl: HeaderComponent) {
  const leaderboardEnabled = configService.features[Feature.enableLeaderboard];
  return (
    <div
      class='gc-header'
      style={{
        backgroundColor: configService.colors.tertiary,
        borderBottom: `2vw solid ${configService.colors.primary}`,
      }}
    >
      <div class='group-left'>
        <div class='logo' style={configService.logoStyle} />
        <div class='group-user-info'>
          <div class='username' style={{ color: configService.colors.text6 }}>
            {ctrl.username}
          </div>
          {ctrl.bucks != null && leaderboardEnabled && (
            <div class='bucks' style={{ color: configService.colors.text6 }}>
              POINTS: {ctrl.bucks}
            </div>
          )}
          {!!ctrl.position && leaderboardEnabled && (
            <div class='position' style={{ color: configService.colors.text6 }}>
              {humanize(ctrl.position).toUpperCase()} PLACE
            </div>
          )}
        </div>
      </div>
      <div class='group-tabs'>
        {ctrl.tabs.map((tab) => {
          const isSelected = m.route.get().includes(tab.route);
          if (tab.label !== 'RANK' || leaderboardEnabled) {
            return (
              <div
                class={`tab${isSelected ? ' active' : ''}`}
                style={{
                  backgroundColor: isSelected
                    ? configService.colors.primary
                    : configService.colors.tertiary,
                  color: configService.colors.text6,
                  borderBottom: `0.5px solid ${
                    isSelected
                      ? configService.colors.primary
                      : configService.colors.tertiary
                  }`,
                }}
                onclick={() => m.route.set(tab.route)}
              >
                {tab.label}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
