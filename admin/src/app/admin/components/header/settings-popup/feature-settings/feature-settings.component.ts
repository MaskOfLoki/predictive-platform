import { ClassComponent, Vnode } from 'mithril';

import { IFeatures } from '../../../../../../../../common';
import { configService } from '../../../../services/ConfigService';
import { template } from './feature-settings.template';

import './feature-settings.component.scss';

interface IFeatureSettingsAttr {
  gameStarted: boolean;
}

export class FeatureSettingsComponent implements ClassComponent<IFeatureSettingsAttr> {
  public gameStarted: boolean;

  public onchange(key: string, value) {
    configService.features[key] = value;
    configService.save();
  }

  public onbeforeupdate(vnode: Vnode<IFeatureSettingsAttr>) {
    this.gameStarted = vnode.attrs.gameStarted;
  }

  public view() {
    return template(this);
  }
}
