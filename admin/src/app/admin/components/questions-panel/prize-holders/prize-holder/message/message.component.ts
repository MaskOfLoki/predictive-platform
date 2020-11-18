import { ClassComponent, redraw, Vnode } from 'mithril';
import { template } from './message.template';
import './message.component.scss';
import * as MiniSignal from 'mini-signals';
import { isEmptyString } from '../../../../../../../../../common';
import { PopupManager } from '../../../../../utils/PopupManager';
import { SmsService } from '../../../../../services/SMSService';
import { email } from '../../../../../services/EmailService';
import { fileService } from '../../../../../services/FileService';

export interface IMessageAttrs {
  closePopup: MiniSignal;
  recipients: string[];
  type: MessageType;
}

export class MessageComponent implements ClassComponent<IMessageAttrs> {
  private _closePopup: MiniSignal;
  private _recipients: string[];
  private _imagePath: string;
  private _imageBase64: string;
  private _sms: SmsService;

  public type: MessageType;
  public text: string;
  public subject: string;

  constructor() {
    this.subject = localStorage.getItem('gc.message.subject');
  }

  public oninit(vnode: Vnode<IMessageAttrs, this>) {
    this._closePopup = vnode.attrs.closePopup;
    this.type = vnode.attrs.type;
    this._sms = new SmsService();

    if (this.type === MessageType.PHONE) {
      this.text = localStorage.getItem('gc.message.text');
    } else {
      this.text = localStorage.getItem('gc.message.email');
    }

    this._recipients = vnode.attrs.recipients;
  }

  public buttonCloseHandler(): void {
    this._closePopup.dispatch();
  }

  public async buttonSendHandler() {
    if (isEmptyString(this.text)) {
      PopupManager.warning('Please, provide message text');
      return;
    }

    localStorage.setItem('gc.message.text', this.text);

    try {
      this._sms.send(this._recipients, this.text);
      this._closePopup.dispatch();
    } catch (e) {
      console.error(e);
      PopupManager.warning(
        `Unable to send text. Details: ${JSON.stringify(e)}`,
      );
    }
  }

  public async buttonSendEmailHandler() {
    if (isEmptyString(this.subject)) {
      PopupManager.warning('Please, provide subject');
      return;
    }

    localStorage.setItem('gc.message.subject', this.subject);

    if (isEmptyString(this.text)) {
      PopupManager.warning('Please, provide email text');
      return;
    }

    localStorage.setItem('gc.message.email', this.text);

    try {
      email.send(this._recipients, this.text, this.subject, this._imagePath);
      this._closePopup.dispatch();
    } catch (e) {
      console.error(e);
      PopupManager.warning(
        `Unable to send email. Details: ${JSON.stringify(e)}`,
      );
    }
  }

  public async buttonAttachImageHandler() {
    if (!isEmptyString(this._imagePath)) {
      this._imagePath = undefined;
      this._imageBase64 = undefined;
      return;
    }

    const file: File = await fileService.selectImage();

    if (!file) {
      return;
    }

    this._imagePath = file.name;
    this._imageBase64 = btoa(
      [].reduce.call(
        new Uint8Array(await file.arrayBuffer()),
        function(p, c) {
          return p + String.fromCharCode(c);
        },
        '',
      ),
    );
    redraw();
  }

  public view() {
    return template(this);
  }

  public get recipients(): string[] {
    return this._recipients;
  }

  public get image(): string {
    if (isEmptyString(this._imagePath)) {
      return;
    }

    return 'data:image/png;base64,' + this._imageBase64;
  }
}

export enum MessageType {
  EMAIL = 'email',
  PHONE = 'phone',
}
