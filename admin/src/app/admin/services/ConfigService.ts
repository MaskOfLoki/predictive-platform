import { api } from './api';
import {
  IConfig,
  IFeatures,
  getLogoStyle,
  isEmptyString,
} from '../../../../../common';

class ConfigService {
  private _config: IConfig;

  constructor() {
    api.config.add((value) => (this._config = value));
  }

  public get email(): string {
    return this._config?.email ? this._config.email : '';
  }

  public get terms(): string {
    return this._config?.terms ? this._config.terms : '';
  }

  public set terms(value: string) {
    this._config.terms = value;
    api.saveConfig(this._config);
  }

  public get gameTitle(): string {
    return this._config?.gameTitle ? this._config.gameTitle : '';
  }

  public set gameTitle(value: string) {
    this._config.gameTitle = value;
    api.saveConfig(this._config);
  }

  public get summaryBelowClock(): string {
    return this._config?.summaryBelowClock
      ? this._config.summaryBelowClock
      : '';
  }

  public set summaryBelowClock(value: string) {
    this._config.summaryBelowClock = value;
    api.saveConfig(this._config);
  }

  public get disclamRulesSummary(): string {
    return this._config?.disclamRulesSummary
      ? this._config.disclamRulesSummary
      : '';
  }

  public set disclamRulesSummary(value: string) {
    this._config.disclamRulesSummary = value;
    api.saveConfig(this._config);
  }

  public get noCountDownSummary(): string {
    return this._config?.noCountDownSummary
      ? this._config.noCountDownSummary
      : '';
  }

  public set noCountDownSummary(value: string) {
    this._config.noCountDownSummary = value;
    api.saveConfig(this._config);
  }

  public get userNamePrefix(): string {
    return this._config?.userNamePrefix ? this._config.userNamePrefix : '';
  }

  public set userNamePrefix(value: string) {
    this._config.userNamePrefix = value;
    api.saveConfig(this._config);
  }

  public get ageGateValue(): number {
    return this._config?.ageGateValue;
  }

  public set ageGateValue(value: number) {
    if (value > 0) {
      this._config.ageGateValue = value;
      api.saveConfig(this._config);
    }
  }

  public get ageGateMessage(): string {
    return this._config?.ageGateMessage ?? '';
  }

  public set ageGateMessage(value: string) {
    this._config.ageGateMessage = value;
    api.saveConfig(this._config);
  }

  public get optInMessage(): string {
    return this._config?.optInMessage ? this._config.optInMessage : '';
  }

  public set optInMessage(value: string) {
    this._config.optInMessage = value;
    api.saveConfig(this._config);
  }

  public get rulesUrl(): string {
    return this._config?.rulesUrl ? this._config.rulesUrl : '';
  }

  public set rulesUrl(value: string) {
    this._config.rulesUrl = value;
    api.saveConfig(this._config);
  }

  public get features(): IFeatures {
    return this._config.features;
  }

  public get logoStyle(): Partial<CSSStyleDeclaration> {
    return getLogoStyle(this._config);
  }

  public save(): void {
    api.saveConfig(this._config);
  }
}

export const configService = new ConfigService();
