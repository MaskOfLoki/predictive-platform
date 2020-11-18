import {ClassComponent, Vnode} from 'mithril';
import './team-selector.component.scss';
import {template} from './team-selector.template';
import {IOverUnderQuestionTeam, IQuestionTeam, ISpreadQuestionTeam} from '../../../../../../../../common';

interface ITeamSelectorsAttrs {
    team: IQuestionTeam;
    selected: boolean;
    onchange: (value: boolean) => void;
}

export class TeamSelectorComponent implements ClassComponent<ITeamSelectorsAttrs> {
    private _team: IQuestionTeam;
    private _selected: boolean;
    private _onchange: (value: boolean) => void;

    public oninit(vnode: Vnode<ITeamSelectorsAttrs, this>) {
        this._team = vnode.attrs.team;
        this._onchange = vnode.attrs.onchange;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ITeamSelectorsAttrs, this>) {
        this._selected = vnode.attrs.selected;
    }

    public clickHandler(): void {
        if (this._selected) {
            return;
        }

        this._selected = true;
        this._onchange(this._selected);
    }

    public view() {
        return template(this);
    }

    public get team(): IQuestionTeam {
        return this._team;
    }

    public get selected(): boolean {
        return this._selected;
    }

    public get spread(): number {
        if ((this._team as ISpreadQuestionTeam).outcomes) {
            const outcome = (this._team as ISpreadQuestionTeam).outcomes[0];

            if (outcome && outcome.spread) {
                return outcome.spread;
            }
        }

        return null;
    }

    public get over(): number {
        if ((this._team as IOverUnderQuestionTeam).outcomes) {
            const outcome = (this._team as IOverUnderQuestionTeam).outcomes[0];

            if (outcome && outcome.over) {
                return outcome.over;
            }
        }

        return null;
    }

    public get under(): number {
        if ((this._team as IOverUnderQuestionTeam).outcomes) {
            const outcome = (this._team as IOverUnderQuestionTeam).outcomes[0];

            if (outcome && outcome.under) {
                return outcome.under;
            }
        }

        return null;
    }
}
