import m from 'mithril';
import { TeamPlatesComponent } from './team-plates.component';
import { TeamPlateComponent } from './team-plate/team-plate.component';
import { ISpreadQuestionTeam } from '../../../../../../../../../common';
import { configService } from '../../../../../../services/config';

export function template(ctrl: TeamPlatesComponent) {
    return (
        <div class='gc-team-plates'>
            <TeamPlateComponent team={ctrl.teamA}
                correct={ctrl.isCorrect}
                pushed={ctrl.pushed}
                selected={ctrl.selectedTeam === ctrl.teamA}
                onclick={() => ctrl.teamSelectionHandler(ctrl.teamA)} />
            <div class='vs' style={{ color: configService.colors.text4 }}>VS</div>
            <TeamPlateComponent team={ctrl.teamB}
                correct={ctrl.isCorrect}
                pushed={ctrl.pushed}
                selected={ctrl.selectedTeam === ctrl.teamB}
                onclick={() => ctrl.teamSelectionHandler(ctrl.teamB)} />
        </div>
    );
}
