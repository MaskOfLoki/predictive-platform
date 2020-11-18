import {ClassComponent, VnodeDOM} from 'mithril';
import {template} from './settings-range.template';
import './settings-range.component.scss';
import flatpickr from 'flatpickr';

interface ISettingsCountdownAttrs {
    onchange: (startTime: Date, endDate: Date) => void;
}

export class SettingsRangeComponent implements ClassComponent<ISettingsCountdownAttrs> {
    private _startTime: Date;
    private _endTime: Date;
    private _onchange: (startTime: Date, endDate: Date) => void;

    public oncreate(vnode: VnodeDOM<ISettingsCountdownAttrs, this>): any {
        this._onchange = vnode.attrs.onchange;
        this._startTime = new Date();
        this._endTime = new Date();
        this._endTime.setDate(this._endTime.getDate() + 1);

        const element: HTMLElement = vnode.dom as HTMLElement;
        flatpickr(element.querySelector('#input-start'), {
            enableTime: true,
            onChange: this.startTimeChangeHandler.bind(this),
            dateFormat: 'm/d/Y H:i',
            defaultDate: this._startTime,
        });
        flatpickr(element.querySelector('#input-end'), {
            enableTime: true,
            onChange: this.endTimeChangeHandler.bind(this),
            dateFormat: 'm/d/Y H:i',
            defaultDate: this._endTime,
        });

        this.dispatchChange();
    }

    private startTimeChangeHandler(selectedDates: Date[]): void {
        this._startTime = selectedDates[0];
        this.dispatchChange();
    }

    private endTimeChangeHandler(selectedDates: Date[]): void {
        this._endTime = selectedDates[0];
        this.dispatchChange();
    }

    private dispatchChange(): void {
        this._onchange(this._startTime, this._endTime);
    }

    public view() {
        return template(this);
    }
}
