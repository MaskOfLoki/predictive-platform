import { LoginComponent } from './app/components/login/login.component';
import { UsernameComponent } from './app/components/username/username.component';
import { MainComponent } from './app/components/main/main.component';
import { TermsComponent } from './app/components/terms/terms.component';
import { PregamePopupComponent } from './app/components/pregame-popup/pregame-popup.component';
import { api } from './app/services/api';
import { CouponService } from './app/services/CouponService';
import { LiveNotificationService } from './app/services/LiveNotificationService';
import { HomeComponent } from './app/components/main/home/home.component';
import { PlayComponent } from './app/components/main/play/play.component';
import { RankComponent } from './app/components/main/rank/rank.component';
import { HowToComponent } from './app/components/main/home/how-to/how-to.component';
import { MyWinsComponent } from './app/components/main/home/my-wins/my-wins.component';
import { xeo } from './app/services/XeoIntegration';
const couponService = new CouponService();
const liveNotification: LiveNotificationService = new LiveNotificationService();

export {
  LoginComponent,
  TermsComponent,
  UsernameComponent,
  MainComponent,
  PregamePopupComponent,
  api,
  HomeComponent,
  PlayComponent,
  RankComponent,
  HowToComponent,
  MyWinsComponent,
  liveNotification,
  couponService,
  xeo,
};
