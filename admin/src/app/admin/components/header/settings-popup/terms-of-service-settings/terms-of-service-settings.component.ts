import {ClassComponent} from 'mithril';
import {template} from './terms-of-service-settings.template';
import './terms-of-service-settings.style.scss';
import { configService } from '../../../../services/ConfigService';
import m from 'mithril';

export class TermsOfServiceSettingsComponent implements ClassComponent {
    private _terms: string;

    public modified = false;

    public oninit(vnode): any {
        this._terms = configService.terms;
    }

    public onSave(): void {
        configService.terms = this._terms;
        this.modified = false;
    }

    public view() {
        return template(this);
    }

    public set markdown(value: string) {
        this.modified = configService.terms !== value;
        this._terms = value;
    }

    public get markdown(): string {
        return (this._terms) ? this._terms : '';
    }
}
