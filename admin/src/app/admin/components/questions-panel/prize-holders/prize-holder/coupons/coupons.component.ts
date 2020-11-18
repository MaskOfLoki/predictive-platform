import { ClassComponent, Vnode } from 'mithril';
import { template } from './coupons.template';
import './coupons.component.scss';
import * as MiniSignal from 'mini-signals';
import { PrizeHolderType } from '../../prize-holders.component';
import {
  CouponStatus,
  IPointsEntry,
  Feature,
} from '../../../../../../../../../common';
import {
  api,
  IPaginatedLeadersRequest,
  IPaginatedLeadersResponse,
} from '../../../../../services/api';
import { PopupManager } from '../../../../../utils/PopupManager';
import { AlertPopupComponent } from '../../../../alert-popup/alert-popup.component';
import m from 'mithril';
import { MessageComponent } from '../message/message.component';
import { IGCCoupon } from '@gamechangerinteractive/gc-firebase/data/IGCCoupon';
import { configService } from '../../../../../services/ConfigService';

export interface IMessageAttrs {
  closePopup: MiniSignal;
  type: PrizeHolderType;
  name: string;
  sessionId: string;
}

export class CouponsComponent implements ClassComponent<IMessageAttrs> {
  public randomAwards = false;
  public randomAwardAmount = 1;

  private _closePopup: MiniSignal;
  private _coupons: IGCCoupon[] = [];
  private _selectedCoupon: IGCCoupon;
  private _selectedUsers: IPointsEntry[] = [];
  private _type: PrizeHolderType;
  private _sessionId: string;
  private _name: string;
  private _users: IPointsEntry[] = [];
  private _leadersRequest: IPaginatedLeadersRequest = {
    current: 0,
    pageSize: 50,
    leaderboard: '',
  };
  private _leadersResponse: IPaginatedLeadersResponse = {
    leaders: [],
    current: 0,
    pageSize: 50,
    total: 0,
  };

  public async oninit(vnode: Vnode<IMessageAttrs, this>) {
    this._closePopup = vnode.attrs.closePopup;
    this._type = vnode.attrs.type;
    this._sessionId = vnode.attrs.sessionId;
    this._name = vnode.attrs.name;
    await this.refresh();
    this._coupons = await api.getCoupons();

    if (this._coupons.length === 0) {
      await PopupManager.warning(
        'Please, add at least one coupon via coupon tool: https://xc.gamechanger.studio',
      );
      this.buttonCloseHandler();
      return;
    }

    this.couponSelectHandler(this._coupons[0]);
    m.redraw();
  }

  public async refresh() {
    switch (this._type) {
      case PrizeHolderType.OVERALL:
        this._leadersRequest.leaderboard = 'overall';
        break;
      case PrizeHolderType.EVENT:
        this._leadersRequest.leaderboard = this._sessionId;
        break;
      case PrizeHolderType.SET:
        this._leadersRequest.leaderboard = `${this._sessionId}-${this._name}`;
        break;
    }

    this._leadersRequest.ageFilter =
      !!configService.features[Feature.filterAge] ||
      (configService.features[Feature.over18] &&
        configService.features[Feature.softGate]);

    this._leadersResponse = await api.getPaginatedLeaders(this._leadersRequest);
    this._users = await api.getAllPaginatedLeaders();
    m.redraw();
  }

  public async reset() {
    this._leadersRequest.current = 0;
    this._selectedUsers = [];
  }

  public paginationChangeHandler(current: number): void {
    this._leadersRequest.current = current;
    this.refresh();
  }

  public couponSelectHandler(value: IGCCoupon) {
    this._selectedCoupon = value;
  }

  public userSelectChangeHandler(user: IPointsEntry, selected: boolean) {
    if (selected && !this._selectedUsers.includes(user)) {
      this._selectedUsers.push(user);
    } else if (!selected && this._selectedUsers.includes(user)) {
      this._selectedUsers.splice(this._selectedUsers.indexOf(user), 1);
    }
  }

  public buttonCloseHandler(): void {
    this._closePopup.dispatch();
  }

  public async buttonAwardLosersHandler() {
    const losers: IPointsEntry[] = this._users.filter(
      (item) => item.points < 1,
    );

    if (losers.length === 0) {
      PopupManager.warning('There are no losers in the list');
      return;
    }

    const len = losers.length;
    const users = `${len} user${len > 1 ? 's' : ''}`;

    const result = await PopupManager.show(AlertPopupComponent, {
      text: `Are you sure you want to award coupon ${this._selectedCoupon.name} to ${users}?`,
    });

    if (!result) {
      return;
    }

    api.awardCoupon(
      this._selectedCoupon,
      losers,
      this._leadersRequest.leaderboard,
    );
    losers.forEach((item) => (item.couponStatus = CouponStatus.SENT));
    m.redraw();
  }

  public async buttonAwardHandler() {
    if (this.randomAwards) {
      if (this.randomAwardAmount < 1) {
        PopupManager.warning(
          'Please enter a random award amount greater than 0',
        );
        return;
      }
      const users = this._users.slice(0);

      if (users.length <= this.randomAwardAmount) {
        this._selectedUsers = users;
      } else {
        let i = this.randomAwardAmount;
        this._selectedUsers = [];
        while (i > 0 && users.length) {
          const idx = Math.round(Math.random() * users.length) % users.length;
          this._selectedUsers.push(users.splice(idx)[0]);
          --i;
        }
      }
    }

    if (this._selectedUsers.length === 0) {
      PopupManager.warning('Please, select at least one user to award');
      return;
    }

    const len = this._selectedUsers.length;
    const users = `${len} user${len > 1 ? 's' : ''}`;

    const result = await PopupManager.show(AlertPopupComponent, {
      text: `Are you sure you want to award coupon ${this._selectedCoupon.name} to ${users}?`,
    });

    if (!result) {
      return;
    }

    api.awardCoupon(
      this._selectedCoupon,
      this._selectedUsers,
      this._leadersRequest.leaderboard,
    );
    this._selectedUsers.forEach(
      (item) => (item.couponStatus = CouponStatus.SENT),
    );
    m.redraw();
  }

  public buttonSelectHandler() {
    if (this._selectedUsers.length === this._users.length) {
      this._selectedUsers = [];
    } else {
      this._selectedUsers = this._users.concat();
    }
  }

  public buttonSelectScoredHandler() {
    this._selectedUsers = this._users.filter((entry) => entry.points > 0);
    PopupManager.show(AlertPopupComponent, {
      text: `${this._selectedUsers.length} users with scores were selected`,
      hideCancelButton: true,
    });
    m.redraw();
  }

  public buttonSelectUnscoredHandler() {
    this._selectedUsers = this._users.filter((entry) => entry.points < 1);
    PopupManager.show(AlertPopupComponent, {
      text: `${this._selectedUsers.length} users without scores were selected`,
      hideCancelButton: true,
    });
    m.redraw();
  }

  public messageHandler() {
    PopupManager.show(MessageComponent, {
      recipients: this._selectedUsers
        .map((item) => item.phone)
        .filter((item) => !!item),
      type: 'phone',
    });
  }

  public emailHandler() {
    PopupManager.show(MessageComponent, {
      recipients: this._selectedUsers
        .map((item) => item.email)
        .filter((item) => !!item),
      type: 'email',
    });
  }

  public onRandomAmountChange(event: Event) {
    const target = event.target as HTMLInputElement;
    let value = Number.parseFloat(target.value);
    if (value > 0) {
      value = Math.floor(value);
      this.randomAwardAmount = value;
    }

    m.redraw();
  }

  public view() {
    return template(this);
  }

  public get coupons(): IGCCoupon[] {
    return this._coupons;
  }

  public get selectedCoupon(): IGCCoupon {
    return this._selectedCoupon;
  }

  public get users(): IPointsEntry[] {
    return this._leadersResponse.leaders;
  }

  public get allUsers(): IPointsEntry[] {
    return this._users;
  }

  public get leadersResponse(): IPaginatedLeadersResponse {
    return this._leadersResponse;
  }

  public get selectedUsers(): IPointsEntry[] {
    return this._selectedUsers;
  }
}
