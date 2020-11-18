import {ClassComponent, Vnode} from 'mithril';
import {template} from './team-plates.template';
import './team-plates.component.scss';
import {IQuestionTeam} from '../../../../../../../../../common';

interface ITeamPlatesAttrs {
    teamA: IQuestionTeam;
    teamB: IQuestionTeam;
    readonly: boolean;
    correct: boolean;
    selectedTeam: IQuestionTeam;
    onchange: (value: IQuestionTeam) => void;
    pushed: boolean;
}

export class TeamPlatesComponent implements ClassComponent<ITeamPlatesAttrs> {
    private _teamA: IQuestionTeam;
    private _teamB: IQuestionTeam;
    private _onchange: (value: IQuestionTeam) => void;
    private _readonly: boolean;
    private _correct: boolean;
    private _selectedTeam: IQuestionTeam;

    public pushed: boolean;

    public oninit(vnode: Vnode<ITeamPlatesAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ITeamPlatesAttrs, this>) {
        this._teamA = vnode.attrs.teamA;
        this._teamB = vnode.attrs.teamB;
        this._selectedTeam = vnode.attrs.selectedTeam;
        this._onchange = vnode.attrs.onchange;
        this._readonly = vnode.attrs.readonly;
        this._correct = vnode.attrs.correct;
        this.pushed = vnode.attrs.pushed;
    }

    public teamSelectionHandler(value: IQuestionTeam): void {
        if (this._readonly) {
            return;
        }

        this._selectedTeam = value;
        this._onchange(value);
    }

    public view() {
        return template(this);
    }

    public get teamA(): IQuestionTeam {
        return this._teamA;
    }

    public get teamB(): IQuestionTeam {
        return this._teamB;
    }

    public get selectedTeam(): IQuestionTeam {
        return this._selectedTeam;
    }

    public get isCorrect(): boolean {
        return this._correct;
    }
}
