import m from 'mithril';

import { Feature } from '../../../../../common';
import { configService } from '../../services/config';
import { UsernameComponent } from './username.component';

export function template(ctrl: UsernameComponent) {
  const showUsername = configService.features[Feature.userInfoUsername];
  const showEmail = configService.features[Feature.userInfoEmail];
  const showName = configService.features[Feature.userInfoName];
  const showShare = configService.features[Feature.userInfoShare];
  const showOver18 = configService.features[Feature.over18];

  return (
    <div class='username-screen'>
      <div
        class='gc-header'
        style={{
          backgroundColor: configService.colors.primary,
          borderBottom: 'none',
        }}
      >
        <div class='group-left'>
          <div class='logo' style={configService.logoStyle} />
          <div
            class='group-logo-info'
            style={{ color: configService.colors.text1 }}
          >
            {configService.gameTitle}
          </div>
        </div>
      </div>
      <div class='group-username'>
        {showUsername && <span>USERNAME:</span>}
        {showUsername && (
          <input
            class='gc-input'
            value={ctrl.username}
            oninput={(e) => (ctrl.username = e.target.value)}
          />
        )}

        {showName && <span>FIRST NAME:</span>}
        {showName && (
          <input
            class='gc-input'
            value={ctrl.firstName}
            oninput={(e) => (ctrl.firstName = e.target.value)}
          />
        )}

        {showName && <span>LAST NAME:</span>}
        {showName && (
          <input
            class='gc-input'
            value={ctrl.lastName}
            oninput={(e) => (ctrl.lastName = e.target.value)}
          />
        )}

        {showEmail && <span>EMAIL:</span>}
        {showEmail && (
          <input
            class='gc-input'
            value={ctrl.email}
            oninput={(e) => (ctrl.email = e.target.value)}
          />
        )}

        {showShare && (
          <label>
            <input
              class='gc-input'
              type='checkbox'
              checked={ctrl.sharedEmail}
              oninput={() => (ctrl.sharedEmail = !ctrl.sharedEmail)}
            />
            <div class='checkbox-text'>{ctrl.optInMessage}</div>
          </label>
        )}

        {showOver18 && (
          <label>
            <input
              class='gc-input'
              type='checkbox'
              checked={ctrl.over18}
              oninput={() => (ctrl.over18 = !ctrl.over18)}
            />
            <div class='checkbox-text large'>{ctrl.ageGateMessage}</div>
          </label>
        )}

        <div class='gc-button' onclick={ctrl.buttonSubmitHandler.bind(ctrl)}>
          SUBMIT
        </div>
      </div>
    </div>
  );
}
