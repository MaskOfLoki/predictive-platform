import m from 'mithril';

import { formatTimer } from '../../../../../common';
import { configService } from '../../services/config';
import { QuestionSetsComponent } from '../main/play/question-sets/question-sets.component';
import { LoginComponent } from './login.component';

export function template(ctrl: LoginComponent) {
  return (
    <div class='login-screen'>
      <div
        class='login-wrapper'
        style={{ 'overflow-y': 'scroll', height: '100vh' }}
      >
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
        <div class='timer-wrapper'>
          {ctrl.isStarted && ctrl.countdown > 0 && (
            <p class='timer-text'>
              <span class='timer-status'>Questions Lock In</span>
              <br />
              {formatTimer(ctrl.countdown)}
            </p>
          )}
          {!(ctrl.isStarted && ctrl.countdown) && ctrl.isManual && (
            <p class='timer-text'>
              <span class='timer-status'>Questions are Live!</span>
            </p>
          )}
          {!(ctrl.isStarted && ctrl.countdown > 0) && !ctrl.isManual && (
            <p class='timer-disable'>
              {m.trust(configService.noCountDownSummary)}
            </p>
          )}
          <p class='timer-description'>{configService.summaryBelowClock}</p>
        </div>
        <div class='group-phone'>
          <span>PHONE NUMBER:</span>
          <input
            type='text'
            class='gc-input'
            placeholder='+1-234-567-8901'
            readonly={ctrl.isSubmitted}
          />
          {!ctrl.isSubmitted && (
            <span
              class='gc-button gc-login'
              onclick={ctrl.buttonSubmitHandler.bind(ctrl)}
            >
              Send Verification SMS
            </span>
          )}
        </div>
        {ctrl.isSubmitted && (
          <div class='group-verify'>
            <div class='info'>
              You will be sent a text containing a code to verify this device.
            </div>
            <span>VERIFICATION CODE:</span>
            <input
              type='text'
              class='gc-input'
              oninput={(e) => (ctrl.verificationCode = e.target.value)}
            />
            <div
              class='gc-button'
              onclick={ctrl.buttonVerifyHandler.bind(ctrl)}
            >
              VERIFY
            </div>
          </div>
        )}

        {configService.disclamRulesSummary && (
          <div class='footer-description'>
            {m.trust(configService.disclamRulesSummary)}
          </div>
        )}

        {ctrl.isStarted && <QuestionSetsComponent isHide={true} />}
      </div>
    </div>
  );
}
