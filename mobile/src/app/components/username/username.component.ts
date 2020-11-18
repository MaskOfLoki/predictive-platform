import { Feature, IConfig, isEmptyString } from '../../../../../common';
import { FeatureFlags } from '../../../../../feature-flags';
import { api } from '../../services/api';
import { configService } from '../../services/config';
import { BaseComponent } from '../../utils/BaseComponent';
import { PopupManager } from '../../utils/PopupManager';
import { template } from './username.template';
import { redraw, route } from 'mithril';
import { MiniSignalBinding } from 'mini-signals';

import './username.component.scss';
import { Profanity } from '../../utils/profanity';

// tslint:disable-next-line: max-line-length
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export class UsernameComponent extends BaseComponent {
  public username = '';
  public email = '';
  public firstName = '';
  public lastName = '';
  public sharedEmail = true;
  public over18 = true;
  public optInMessage = '';
  public ageGateMessage = '';
  private _subscription: MiniSignalBinding;
  private _config: IConfig;

  public oncreate() {
    this._subscription = api.config.add(this.configHandler.bind(this));
  }

  private configHandler(value: IConfig): void {
    this._config = value;

    if (value.userNamePrefix) {
      this.username =
        value.userNamePrefix + `${Math.round(Math.random() * 1000000)}`;
    }

    if (value.optInMessage) {
      this.optInMessage = value.optInMessage;
    }

    if (value.ageGateMessage) {
      this.ageGateMessage = value.ageGateMessage.replace(
        /\{AGE\}/g,
        value.ageGateValue.toString(),
      );
    }

    redraw();
  }

  public async buttonSubmitHandler(): Promise<void> {
    const updates: any = {};

    if (
      configService.features[Feature.over18] &&
      configService.features[Feature.over18Required]
    ) {
      if (!this.over18) {
        PopupManager.warning('You must be over 18 to play along');
        return;
      }
    }
    if (configService.features[Feature.userInfoUsername]) {
      if (isEmptyString(this.username)) {
        PopupManager.warning('Please, provide valid username');
        return;
      }

      if (Profanity.isProfane(this.username)) {
        PopupManager.warning('Please, provide another username');
        return;
      }

      const result = await api.updateUsername(this.username);

      if (!result) {
        PopupManager.warning('Username is taken. Please, provide another one');
        return;
      }
    }

    if (configService.features[Feature.userInfoEmail]) {
      if (!emailRegex.test(this.email)) {
        PopupManager.warning('Please provide your email.');
        return;
      }

      updates.email = this.email;
    }

    if (configService.features[Feature.userInfoName]) {
      if (isEmptyString(this.firstName) || isEmptyString(this.lastName)) {
        PopupManager.warning('Please fill out both your first and last name');
        return;
      }
      updates.firstName = this.firstName;
      updates.lastName = this.lastName;
    }

    if (configService.features[Feature.userInfoShare]) {
      updates.sharedEmail = this.sharedEmail;
    }

    if (configService.features[Feature.over18]) {
      updates.over18 = this.over18;

      if (configService.features[Feature.softGate]) {
        updates.additional = {
          isFiltered: !this.over18,
        };
      }
    }

    api.updateUser(updates);

    if (
      !this._config?.popup ||
      localStorage.getItem('popup_url') === this._config?.popup?.url
    ) {
      if (FeatureFlags.HomePage) {
        route.set('/home');
      } else {
        route.set('/play');
      }
    } else {
      route.set('/popup');
    }
  }

  public view() {
    return template(this);
  }
}
