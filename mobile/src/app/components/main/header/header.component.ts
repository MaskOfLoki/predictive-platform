import { template } from './header.template';
import './header.component.scss';
import { MiniSignalBinding } from 'mini-signals';
import { ClassComponent } from 'mithril';
import { api } from '../../../services/api';
import { IPointsEntry, IUser } from '../../../../../../common';
import m from 'mithril';
import { FeatureFlags } from '../../../../../../feature-flags';
import { isXeo } from '../../../utils';

export class HeaderComponent implements ClassComponent {
  private readonly _subscriptions: MiniSignalBinding[] = [];
  private _username: string;
  private _bucks: number;
  private _position: number;
  private _uid: string;
  private _tabs: ITab[] = [
    {
      route: '/home',
      label: 'HOME',
    },
    {
      route: '/play',
      label: 'PLAY',
    },
    {
      route: '/rank',
      label: 'RANK',
    },
  ];

  constructor() {
    this._subscriptions.push(api.user.add(this.userHandler.bind(this)));
    this._subscriptions.push(
      api.overallPosition.add((value: IPointsEntry) => {
        this._position = value ? value.position : 0;
        m.redraw();
      }),
    );

    if (isXeo()) {
      this._tabs = this._tabs.splice(1, 1);
    } else {
      if (!FeatureFlags.HomePage) {
        this._tabs.shift();
      }
    }
  }

  private async userHandler(value: IUser) {
    if (!value) {
      return;
    }

    this._uid = value.uid;
    this._username = value.username;
    this._bucks = value.bucks;
    m.redraw();

    api.getOverallPosition();
  }

  public view() {
    return template(this);
  }

  public onremove() {
    this._subscriptions.forEach((item) => item.detach());
  }

  public get username(): string {
    return this._username;
  }

  public get bucks(): number {
    return this._bucks;
  }

  public get position(): number {
    return this._position;
  }

  public get tabs() {
    return this._tabs;
  }
}

interface ITab {
  route: string;
  label: string;
}
