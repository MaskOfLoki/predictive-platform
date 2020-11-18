import m from 'mithril';
import {TeamSelectorsComponent} from './team-selectors.component';
import {TeamSelectorComponent} from './team-selector/team-selector.component';

export function template(ctrl: TeamSelectorsComponent) {
    return (
        <div class='gc-team-selectors'>
            <TeamSelectorComponent team={ctrl.question.teamA}
                                   selected={ctrl.question.winner === ctrl.question.teamA.name}
                                   onchange={() => ctrl.question.winner = ctrl.question.teamA.name}/>
            <TeamSelectorComponent team={ctrl.question.teamB}
                                   selected={ctrl.question.winner === ctrl.question.teamB.name}
                                   onchange={() => ctrl.question.winner = ctrl.question.teamB.name}/>
        </div>
    );
}
