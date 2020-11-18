import m from 'mithril';
import {PredictiveStatsComponent} from './predictive-stats.component';

export function template(ctrl: PredictiveStatsComponent) {
  return (
    <div class='gc-predictive-stats'>
      {ctrl.answers.map(item =>
        <div class='stat-item'
            style={{
              backgroundColor: ctrl.config.colors.primary,
              borderColor: ctrl.config.colors.primary,
            }}>
            <div class='answer' style={{color: ctrl.config.colors.text4}}>
              {item.answer}
            </div>
            <div class='stats'>
              <div class='fill'
                style={{width: `${item.percentage}%`}}/>
              <div class='percentage' style={{color: ctrl.config.colors.text4}}>{item.percentage}%</div>
              <div class='bucks' style={{color: ctrl.config.colors.text4}}>
                {item.bucks} POINTS
              </div>
            </div>
          </div>)}
    </div>
  );
}
