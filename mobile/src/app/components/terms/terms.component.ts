import { template } from './terms.template';
import './terms.component.scss';
import m, { VnodeDOM } from 'mithril';
import { BaseComponent } from '../../utils/BaseComponent';
import { configService } from '../../services/config';
import { FeatureFlags } from '../../../../../feature-flags';
import { IUser } from '../../../../../common';

import { api } from '../../services/api';

export class TermsComponent extends BaseComponent {
    public terms: string;

    public async oninit(vnode: VnodeDOM) {
        this.terms = configService.terms ? configService.terms : '';
    }
    public view() {
        return template(this);
    }
    public get markdown(): string {
        return (this.terms) ? this.terms : '';
    }
}
