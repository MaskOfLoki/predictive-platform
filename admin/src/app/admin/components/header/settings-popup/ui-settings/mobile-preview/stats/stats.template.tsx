import m from 'mithril';
import { StatsComponent } from './stats.component';

export function template(ctrl: StatsComponent) {
  return (
      <div class='gc-mobile-stats'
           style={{
               backgroundColor: ctrl.config.colors.secondary,
               borderColor: ctrl.config.colors.primary,
               justifyContent: 'space-between',
           }}>
          <div class='mobile-column'>
              <div class='mobile-row'>
                  <div class='icon-dollar' style={{backgroundColor: ctrl.config.colors.primary}}/>
                  <div class='label'
                       style={{color: ctrl.config.colors.primary}}>
                      POINTS
                  </div>
              </div>
              <div class='line' style={{backgroundColor: ctrl.config.colors.primary}}/>
              <div class='value'
                   style={{color: ctrl.config.colors.text4}}>
                  1234
              </div>
          </div>

          <div class='mobile-column'>
              <div class='mobile-row'>
                  <div class='icon-rank' style={{backgroundColor: ctrl.config.colors.primary}}/>
                  <div class='label'
                       style={{color: ctrl.config.colors.primary}}>
                      CURRENT RANK
                  </div>
              </div>
              <div class='line' style={{backgroundColor: ctrl.config.colors.primary}}/>
              <div class='value'
                   style={{color: ctrl.config.colors.text4}}>
                  7TH PLACE
              </div>
          </div>

          <div class='mobile-column'>
              <div class='mobile-row'>
                  <div class='icon-checkmark' style={{backgroundColor: ctrl.config.colors.primary}}/>
                  <div class='label'
                       style={{color: ctrl.config.colors.primary}}>
                      CORRECT ANSWERS
                  </div>
              </div>
              <div class='line' style={{backgroundColor: ctrl.config.colors.primary}}/>
              <div class='value'
                   style={{color: ctrl.config.colors.text4}}>
                  12 / 39
              </div>
          </div>
      </div>
  );
}