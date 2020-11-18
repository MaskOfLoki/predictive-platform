import {ClassComponent, Vnode} from 'mithril';
import {template} from './timer.template';
import './timer.component.scss';

interface ITimerAttrs {
    onchange: (value: number) => void;
    value: number;
    readonly: boolean;
}

export class TimerComponent implements ClassComponent<ITimerAttrs> {
    private _onchange: (value: number) => void;
    private _readonly: boolean;

    public value = 30;

    public oninit(vnode: Vnode<ITimerAttrs, this>) {
        this._onchange = vnode.attrs.onchange;
        this.value = vnode.attrs.value;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ITimerAttrs, this>) {
        this._readonly = vnode.attrs.readonly;
    }

    public inputHandler(e): void {
        this.value = parseInt(e.target.value, 10);
        this._onchange(this.value);
    }

    public view() {
        return template(this);
    }

    public get readonly(): boolean {
        return this._readonly;
    }
}
