import {ClassComponent, Vnode} from 'mithril';
import {template} from './pagination.template';
import './pagination.component.scss';

interface IPaginationAttrs {
    total: number;
    pageSize: number;
    current: number;
    onchange: () => void;
}

export class PaginationComponent implements ClassComponent<IPaginationAttrs> {
    private _total: number;
    private _pageSize: number;
    private _current: number = 0;
    private _onchange: (value: number) => void;

    public oninit(vnode: Vnode<IPaginationAttrs, this>) {
        this._onchange = vnode.attrs.onchange;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IPaginationAttrs, this>) {
        this._total = vnode.attrs.total;
        this._pageSize = vnode.attrs.pageSize;
        this._current = vnode.attrs.current;
    }

    public buttonPrevHandler() {
        if (this._current <= 0) {
            return;
        }

        this._current -= this.pageSize;
        this._onchange(this._current);
    }

    public buttonNextHandler() {
        const current = this._current + this.pageSize;

        if (current >= this.total) {
            return;
        }

        this._current = current;
        this._onchange(current);
    }

    public view() {
        return template(this);
    }

    public get total(): number {
        return this._total;
    }

    public get pageSize(): number {
        return this._pageSize;
    }

    public get lastPage(): number {
        const result = this._current + this._pageSize;

        if (result > this._total) {
            return this._total;
        }

        return result;
    }

    public get current(): number {
        return this._current;
    }
}
