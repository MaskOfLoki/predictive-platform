import { isIOS } from '@gamechangerinteractive/gc-firebase/utils';
import m from 'mithril';

import { BRANCH, Feature, VERSION } from '../../common';
import { FeatureFlags } from '../../feature-flags';
import { configService } from './app/services/config';
import { loading } from './app/services/LoadingService';
import { PleaseRotate } from './app/utils/please-rotate';
import { initRoutes } from './main.routes';

import './styles.scss';
import { isXeo } from './app/utils';

// tslint:disable-next-line:no-console
console.log(
  `%c Predictive Platform Mobile, ${BRANCH}, version ${VERSION}`,
  'background: #222; color: #bada55',
);

// Disabled per request
// PleaseRotate.start();

async function init(): Promise<void> {
  iosTweaks();
  location.href = '#!/splash';
  initRoutes();

  const module = await loading.wrap(import('./main.module'));
  const user = await loading.wrap(module.api.isLoggedIn());

  module.liveNotification.start();
  module.couponService.start();

  if (!user) {
    m.route.set('/login');
    return;
  } else if (!user.username) {
    if (!configService.features[Feature.userInfoUsername]) {
      module.api.updateUser({
        username: `${configService.userNamePrefix}${Math.round(
          Math.random() * 1000000,
        )}`,
      });
    } else {
      m.route.set('/username');
      return;
    }
  } else if (!user.email && configService.features[Feature.userInfoEmail]) {
    m.route.set('/username');
    return;
  }

  if (
    configService.features[Feature.over18] &&
    ((configService.features[Feature.softGate] &&
      user.additional?.isFiltered === undefined) ||
      user.over18 === undefined)
  ) {
    m.route.set('/username');
    return;
  }

  if (
    !configService.popup ||
    localStorage.getItem('popup_url') === configService.popup.url
  ) {
    if (FeatureFlags.HomePage && !isXeo()) {
      m.route.set('/home');
    } else {
      m.route.set('/play');
    }
  } else {
    m.route.set('/popup');
  }
}

function iosTweaks() {
  if (!isIOS()) {
    return;
  }

  // prevent double tap zoom
  let lastTouchEnd = 0;
  document.addEventListener(
    'touchend',
    (event) => {
      const now = new Date().getTime();

      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }

      lastTouchEnd = now;
    },
    false,
  );
}

init();
