import {ClassComponent, Vnode} from 'mithril';
import './team-selectors.component.scss';
import {
    IBetMoneylineQuestion,
} from '../../../../../../../common';
import {template} from './team-selectors.template';

interface ITeamSelectorsAttrs {
    question?: IBetMoneylineQuestion;
}

export class TeamSelectorsComponent implements ClassComponent<ITeamSelectorsAttrs> {
    private _question: IBetMoneylineQuestion;

    public oninit(vnode: Vnode<ITeamSelectorsAttrs, this>) {
        this._question = vnode.attrs.question;
    }

    public view() {
        return template(this);
    }

    public get question(): IBetMoneylineQuestion {
        return this._question;
    }
}
