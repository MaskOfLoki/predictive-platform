import { BehaviorMiniSignal } from '../../utils/BehaviorMiniSignal';
import {
  getLogoStyle,
  IColors,
  IConfig,
  IFeatures,
  IFont,
  IFileData,
  fillDefaultConfig,
} from '../../../../../common';
import { api } from '../api';
import { redraw } from 'mithril';
import { IGCFileData } from '@gamechangerinteractive/gc-firebase';

export class ConfigService extends BehaviorMiniSignal {
  protected _config: IConfig = fillDefaultConfig();
  private _styleFont: HTMLElement;
  private _font: IFont;

  constructor() {
    super();
    api.config.add(this.configHandler.bind(this));
  }

  protected updateFont(value: IFont) {
    if (value && this._font && this._font.file.path === value.file.path) {
      return;
    }

    if (this._styleFont) {
      document.head.removeChild(this._styleFont);
      this._styleFont = undefined;
    }

    this._font = value;

    if (value) {
      this._styleFont = document.createElement('style');
      this._styleFont.appendChild(
        document.createTextNode(`
            @font-face {
                font-family: "${value.name}";
                src: url(${value.file.url});
            }`),
      );

      document.head.appendChild(this._styleFont);
    }

    redraw();
  }

  protected configHandler(value: IConfig): void {
    this._config = value;
    this.updateFont(this._config.font);
    this.dispatch(value);
    redraw();
  }

  public get colors(): IColors {
    return this._config.colors;
  }

  public get features(): IFeatures {
    return this._config?.features;
  }

  public get popup(): IFileData {
    return this._config?.popup;
  }

  public get logoStyle(): Partial<CSSStyleDeclaration> {
    return getLogoStyle(this._config);
  }

  public get terms(): string {
    return this._config.terms;
  }

  public get gameOverTitle(): string {
    return this._config.gameOverTitle;
  }

  public get gameOverSubtitle(): string {
    return this._config.gameOverSubtitle;
  }

  public get gameTitle(): string {
    return this._config.gameTitle;
  }

  public get summaryBelowClock(): string {
    return this._config.summaryBelowClock;
  }

  public get disabledSetLeaderboard(): boolean {
    return this._config.disabledSetLeaderboard;
  }

  public get disabledDailyLeaderboard(): boolean {
    return this._config.disabledDailyLeaderboard;
  }

  public get disclamRulesSummary(): string {
    return this._config?.disclamRulesSummary
      ? this._config.disclamRulesSummary
      : '';
  }

  public get noCountDownSummary(): string {
    return this._config?.noCountDownSummary
      ? this._config.noCountDownSummary
      : '';
  }

  public get userNamePrefix(): string {
    return this._config?.userNamePrefix ? this._config.userNamePrefix : '';
  }

  public get optInMessage(): string {
    return this._config?.optInMessage ? this._config.optInMessage : '';
  }

  public get rulesUrl(): string {
    return this._config?.rulesUrl ? this._config.rulesUrl : '';
  }

  public get fontStyle() {
    if (!this._font) {
      return {};
    }

    return {
      fontFamily: `"${this._font.name}"`,
    };
  }

  public get background(): IGCFileData {
    return this._config.background;
  }

  public get gameOverImage(): IGCFileData {
    return this._config.gameOverImage;
  }
}
