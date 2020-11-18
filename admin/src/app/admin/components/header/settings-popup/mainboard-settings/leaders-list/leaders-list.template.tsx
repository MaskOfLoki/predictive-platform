import { LeadersListComponent } from './leaders-list.component';
import m from 'mithril';
import { isXeo } from '../../../../../../utils';

export function template(ctrl: LeadersListComponent) {
  return (
    <div class='gc-leaders-list'>
      <div class='group-title'>
        <span>LEADERS</span>
      </div>
      <div class='group-leaders'>
        {ctrl.leaders.map((leader, index) => (
          <div class='leader'>
            <div class='username'>
              {index + 1}. {leader.username}
            </div>
            <div class='bucks'>{leader.points}</div>
          </div>
        ))}
      </div>
      {ctrl.leaders.length > 0 && !isXeo() && (
        <div class='gc-button' onclick={ctrl.buttonShareHandler.bind(ctrl)}>
          SHARE TO MAINBOARD
        </div>
      )}
    </div>
  );
}
