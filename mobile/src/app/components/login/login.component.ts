import { BaseComponent } from '../../utils/BaseComponent';
import { template } from './login.template';
import './login.component.scss';
import m, { VnodeDOM } from 'mithril';
import IMask from 'imask';
import { api } from '../../services/api';
import { Feature, IUser } from '../../../../../common';
import { PopupManager } from '../../utils/PopupManager';
import { PhoneService } from '../../services/PhoneService';
import { getQueryParam } from '../../utils';
import { FeatureFlags } from '../../../../../feature-flags';
import { configService } from '../../services/config';

import { MiniSignalBinding } from 'mini-signals';
import { IEvent, IGameState, ScheduleType } from '../../../../../common';
import { getActiveLiveQuestions, getActiveQuestionSets } from '../../utils';

const userInfoFeatures = [
  Feature.userInfoEmail,
  Feature.userInfoName,
  Feature.userInfoUsername,
  Feature.over18,
];

export class LoginComponent extends BaseComponent {
  private _isSubmitted: boolean;
  private _maskedPhone: IMask.InputMask<{ mask: string }>;
  private _phonePinId: string;
  private readonly _phoneService: PhoneService = new PhoneService();
  private _isStarted: boolean;
  private _isManual: boolean;
  private _subscription: MiniSignalBinding;
  private _timerRefresh: number;
  private _countdown = 0;
  public render = false;
  public verificationCode: string;

  public oncreate(vnode: VnodeDOM) {
    const inputElement: HTMLInputElement = vnode.dom
      .querySelector('.group-phone')
      .querySelector('input');
    inputElement.value = '+1';
    this._maskedPhone = IMask(
      vnode.dom.querySelector('.group-phone').querySelector('input'),
      {
        mask: '+0-000-000-0000',
      },
    );
    api.loginAnonymously();

    this._subscription = api.state.add((value) =>
      setTimeout(this.stateHandler.bind(this, value), 50),
    );
  }

  public async buttonSubmitHandler(): Promise<void> {
    const phone = this._maskedPhone.unmaskedValue.trim();

    if (phone.length !== 11) {
      PopupManager.warning('Please, provide valid phone number.');
      return;
    }

    try {
      if (GC_PRODUCTION) {
        const result = await this._phoneService.validatePhone(phone);
        this._phonePinId = result.id;
      }

      this._isSubmitted = true;
      m.redraw();
    } catch (e) {
      const message = e.response ? e.response.data : e.toString();
      PopupManager.warning(`Unable to submit phone. Details: ${message}`);
    }
  }

  public async buttonVerifyHandler(): Promise<void> {
    try {
      if (GC_PRODUCTION) {
        await this._phoneService.validatePin(
          this.verificationCode,
          this._phonePinId,
        );
      }
    } catch (e) {
      const message = e.response ? e.response.data : e.toString();
      PopupManager.warning(
        `Please, make sure verification code is correct. Details: ${message}`,
      );
      return;
    }

    const result: IUser = await api.login(
      this._maskedPhone.unmaskedValue,
      getQueryParam('email'),
    );

    if (!result.username || !result.email) {
      if (
        configService.features &&
        !configService.features[Feature.userInfoUsername]
      ) {
        api.updateUser({
          username: `Fan${Math.round(Math.random() * 1000000)}`,
        });
      }

      if (userInfoFeatures.some((feature) => configService.features[feature])) {
        m.route.set('/username');
        return;
      }
    }

    if (
      !configService.popup ||
      localStorage.getItem('popup_url') === configService.popup.url
    ) {
      if (FeatureFlags.HomePage) {
        m.route.set('/home');
      } else {
        m.route.set('/play');
      }
    } else {
      m.route.set('/popup');
    }
  }

  public view() {
    return template(this);
  }

  public get isSubmitted(): boolean {
    return this._isSubmitted;
  }

  private stateHandler(value: IGameState): void {
    clearTimeout(this._timerRefresh);

    if (!value.sessionId) {
      this._isStarted = false;
      this._countdown = 0;
      return;
    }
    this.render = true;
    this.refresh(value.event);
  }

  private refresh(event: IEvent): void {
    let questions = getActiveLiveQuestions(event.data);
    const activeQuestions = getActiveQuestionSets(event.data);

    this._isManual = activeQuestions.some(
      (questionSet) =>
        questionSet.scheduleType === ScheduleType.MANUAL &&
        questionSet.questions.length > 0,
    );

    activeQuestions.forEach((questionSet) => {
      if (questionSet.scheduleType === ScheduleType.MANUAL) {
        return;
      }
      questions = questions.concat(questionSet.questions);
    });

    this._isStarted = questions.length > 0;
    questions = questions.filter(
      (question) =>
        !question.awarded &&
        !question.locked &&
        !question.pushed &&
        !!question.countdown,
    );
    questions.sort((q1, q2) => q1.countdown - q2.countdown);
    const question = questions[0];
    this._countdown = question ? question.countdown : 0;
    m.redraw();
    this._timerRefresh = window.setTimeout(
      this.refresh.bind(this, event),
      1000,
    );
  }

  public onremove() {
    this._subscription.detach();
    clearTimeout(this._timerRefresh);
  }

  public get countdown(): number {
    return this._countdown;
  }

  public get isManual(): boolean {
    return this._isManual;
  }

  public get isStarted(): boolean {
    return this._isStarted;
  }
}
