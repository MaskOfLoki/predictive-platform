import { ClassComponent } from 'mithril';
import { template } from './sms-notification-settings.template';
import './sms-notification-settings.component.scss';
import { isEmptyString, IUser } from '../../../../../../../../common';
import { api } from '../../../../services/api';
import { PopupManager } from '../../../../utils/PopupManager';
import { AlertPopupComponent } from '../../../alert-popup/alert-popup.component';
import { SmsService } from '../../../../services/SMSService';

export class SmsNotificationSettingsComponent implements ClassComponent {
  public text: string;
  private _sms: SmsService;

  public oninit(): void {
    this._sms = new SmsService();
  }

  public async buttonSendHandler() {
    if (isEmptyString(this.text)) {
      PopupManager.warning('Please, provide notification message');
      return;
    }

    let users: IUser[] = await api.getRegisteredUsers();
    users = users.filter((user) => !!user.phone);

    if (users.length === 0) {
      PopupManager.warning('No users to send message');
      return;
    }

    const len = users.length;
    const usersLabel = `${len} user${len > 1 ? 's' : ''}`;

    const result = await PopupManager.show(AlertPopupComponent, {
      text: `Are you sure you want to send message to ${usersLabel}?`,
    });

    if (!result) {
      return;
    }

    this._sms.send(
      users.map((item) => item.phone),
      this.text,
    );
    PopupManager.warning('Notification sent');
  }

  public view() {
    return template(this);
  }
}
