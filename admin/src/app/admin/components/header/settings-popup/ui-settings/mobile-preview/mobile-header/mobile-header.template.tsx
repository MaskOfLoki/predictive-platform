import m from 'mithril';
import { MobileHeaderComponent } from './mobile-header.component';
import {configService} from '../../../../../../services/ConfigService';

export function template(ctrl: MobileHeaderComponent) {
  return (
    <div class='gc-mobile-header'
      style={{
          backgroundColor: ctrl.config.colors.tertiary,
          borderBottom: `2px solid ${ctrl.config.colors.primary}`,
      }}>
      <div class='group-left'>
          <div class='logo' style={configService.logoStyle}/>
          <div class='group-user-info'>
              <div class='username' style={{color: ctrl.config.colors.text6}}>
                  User1234
              </div>
              <div class='bucks' style={{color: ctrl.config.colors.text6}}>
                  POINTS: 1234
              </div>
              <div class='position' style={{color: ctrl.config.colors.text6}}>
                7TH PLACE
              </div>
          </div>
      </div>
      <div class='mobile-group-tabs'>
        <div class={`tab ${ctrl.selectedTab === 0 || ctrl.selectedTab === 3 ? 'active' : ''}`}
          style={{
            backgroundColor: ctrl.selectedTab === 0 || ctrl.selectedTab === 3 ?
              ctrl.config.colors.primary :
              ctrl.config.colors.tertiary,
            color: ctrl.config.colors.text6,
            borderBottom: `1px solid ${ctrl.config.colors.primary}`,
          }}>
          HOME
        </div>
        <div class={`tab ${ctrl.selectedTab === 1 ? 'active' : ''}`}
          style={{
            backgroundColor: ctrl.selectedTab === 1 ?
              ctrl.config.colors.primary :
              ctrl.config.colors.tertiary,
            color: ctrl.config.colors.text6,
            borderBottom: `1px solid ${ctrl.config.colors.primary}`,
          }}>
          PLAY
        </div>
        <div class={`tab ${ctrl.selectedTab === 2 ? 'active' : ''}`}
          style={{
            backgroundColor: ctrl.selectedTab === 2 ?
              ctrl.config.colors.primary :
              ctrl.config.colors.tertiary,
            color: ctrl.config.colors.text6,
            borderBottom: `1px solid ${ctrl.config.colors.primary}`,
          }}>
          RANK
        </div>
      </div>
    </div>
  );
}
