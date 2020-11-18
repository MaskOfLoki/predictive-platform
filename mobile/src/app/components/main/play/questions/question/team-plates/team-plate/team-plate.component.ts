import {ClassComponent, Vnode} from 'mithril';
import {template} from './team-plate.template';
import './team-plate.component.scss';
import {IOverUnderQuestionTeam, IQuestionTeam, ISpreadQuestionTeam} from '../../../../../../../../../../common';

interface ITeamPlateAttrs {
    team: IQuestionTeam;
    correct: boolean;
    selected: boolean;
    onclick: (team: IQuestionTeam) => void;
    pushed: boolean;
}

export class TeamPlateComponent implements ClassComponent<ITeamPlateAttrs> {
    private _team: IQuestionTeam;
    private _correct: boolean;
    private _selected: boolean;
    private _onclick: (team: IQuestionTeam) => void;

    public pushed: boolean;

    public oninit(vnode: Vnode<ITeamPlateAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ITeamPlateAttrs, this>) {
        this._team = vnode.attrs.team;
        this._correct = vnode.attrs.correct;
        this._selected = vnode.attrs.selected;
        this._onclick = vnode.attrs.onclick;
        this.pushed = vnode.attrs.pushed;
    }

    public view() {
        return template(this);
    }

    public get team(): IQuestionTeam {
        return this._team;
    }

    public get isCorrect(): boolean {
        return this._correct;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public get onclick() {
        return this._onclick;
    }

    public get spread(): number {
        const outcomes = (this._team as ISpreadQuestionTeam).outcomes;

        if (!outcomes || !outcomes[0]) {
            return null;
        }

        return outcomes[0].spread;
    }

    public get under(): number {
        const outcomes = (this._team as IOverUnderQuestionTeam).outcomes;

        if (!outcomes || !outcomes[0]) {
            return null;
        }

        return outcomes[0].under;
    }

    public get over(): number {
        const outcomes = (this._team as IOverUnderQuestionTeam).outcomes;

        if (!outcomes || !outcomes[0]) {
            return null;
        }

        return outcomes[0].over;
    }
}
