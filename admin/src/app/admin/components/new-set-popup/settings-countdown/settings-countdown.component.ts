import {ClassComponent, Vnode} from 'mithril';
import {template} from './settings-countdown.template';
import './settings-countdown.component.scss';
import { IQuestionSet } from '../../../../../../../common';

interface ISettingsCountdownAttrs {
    seconds: number;
    onchange: (value: number) => void;
}

export class SettingsCountdownComponent implements ClassComponent<ISettingsCountdownAttrs> {
    public seconds = 0;
    public minutes = 30;
    public hours = 0;

    private _onchange: (value: number) => void;

    public oninit(vnode: Vnode<ISettingsCountdownAttrs, this>): any {
        this._onchange = vnode.attrs.onchange;

        if (typeof vnode.attrs.seconds === 'number') {
            let time = vnode.attrs.seconds;
            this.hours = Math.floor(time / 3600);
            time = time - this.hours * 3600;

            this.minutes = Math.floor(time / 60);

            this.seconds = time - this.minutes * 60;
        }
    }

    public oncreate() {
        this.dispatchChange();
    }

    public inputSecondsHandler(e) {
        this.seconds = parseInt(e.target.value, 10);

        if (this.seconds > 59) {
            this.seconds = 59;
        } else if (this.seconds < 0) {
            this.seconds = 0;
        }

        this.dispatchChange();
    }

    public inputMinutesHandler(e) {
        this.minutes = parseInt(e.target.value, 10);

        if (this.minutes > 59) {
            this.minutes = 59;
        } else if (this.minutes < 0) {
            this.minutes = 0;
        }

        this.dispatchChange();
    }

    public inputHoursHandler(e) {
        this.hours = parseInt(e.target.value, 10);

        if (this.hours < 0) {
            this.hours = 0;
        }

        this.dispatchChange();
    }

    private dispatchChange(): void {
        const h = isNaN(this.hours) ? 0 : this.hours;
        const m = isNaN(this.minutes) ? 0 : this.minutes;
        const s = isNaN(this.seconds) ? 0 : this.seconds;
        this._onchange(h * 3600 + m * 60 + s);
    }

    public view() {
        return template(this);
    }
}
