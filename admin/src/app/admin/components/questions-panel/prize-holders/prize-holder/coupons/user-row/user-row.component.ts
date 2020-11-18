import {ClassComponent, Vnode} from 'mithril';
import {template} from './user-row.template';
import './user-row.component.scss';
import {CouponStatus, IPointsEntry} from '../../../../../../../../../../common';

export interface IUserRowAttrs {
    user: IPointsEntry;
    selected: boolean;
    onchange: (user: IPointsEntry, selected: boolean) => void;
}

export class UserRowComponent implements ClassComponent<IUserRowAttrs> {
    private _user: IPointsEntry;
    private _selected: boolean;
    private _onchange: (user: IPointsEntry, selected: boolean) => void;

    public oninit(vnode: Vnode<IUserRowAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IUserRowAttrs, this>) {
        this._selected = vnode.attrs.selected;
        this._onchange = vnode.attrs.onchange;

        if (this._user === vnode.attrs.user) {
            return;
        }

        this._user = vnode.attrs.user;

        if (!this._user.couponStatus) {
            this._user.couponStatus = CouponStatus.NOT_SENT;
        }
    }

    public clickHandler() {
        this._selected = !this._selected;
        this._onchange(this._user, this._selected);
    }

    public view() {
        return template(this);
    }

    public get user(): IPointsEntry {
        return this._user;
    }

    public get selected(): boolean {
        return this._selected;
    }
}
