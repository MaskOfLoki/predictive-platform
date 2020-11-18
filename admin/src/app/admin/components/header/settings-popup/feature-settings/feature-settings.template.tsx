import m from 'mithril';

import { Feature } from '../../../../../../../../common';
import { configService } from '../../../../services/ConfigService';
import { AccordionComponent } from '../../../accordion/accordion.component';
import { FeatureSettingsComponent } from './feature-settings.component';
import { FeatureToggleComponent } from './feature-toggle/feature-toggle.component';

export function template(ctrl: FeatureSettingsComponent) {
  return (
    <div class='gc-feature-settings'>
      <div class='content'>
        <AccordionComponent label='XEO INTEGRATION'>
          <FeatureToggleComponent
            label='Filter out users below the Age Gate value in XEO'
            value={configService.features[Feature.filterAge]}
            onchange={ctrl.onchange.bind(ctrl, Feature.filterAge)}
          />
        </AccordionComponent>
        <AccordionComponent label='POINTS'>
          <FeatureToggleComponent
            label='Display Point Values for Predictive Questions'
            value={configService.features[Feature.displayPredictivePoints]}
            onchange={ctrl.onchange.bind(ctrl, Feature.displayPredictivePoints)}
          />
          <FeatureToggleComponent
            label='Display Point Values for Poll Questions'
            value={configService.features[Feature.displayPollPoints]}
            onchange={ctrl.onchange.bind(ctrl, Feature.displayPollPoints)}
          />
        </AccordionComponent>
        <AccordionComponent label='MOBILE'>
          <FeatureToggleComponent
            label='Show Multichoice Poll Results on Mobile'
            value={configService.features[Feature.inlinePollResults]}
            onchange={ctrl.onchange.bind(ctrl, Feature.inlinePollResults)}
          />
        </AccordionComponent>
        <AccordionComponent label='LEADERBOARD'>
          <FeatureToggleComponent
            label='Enable all Leaderboard Related Features'
            value={configService.features[Feature.enableLeaderboard]}
            onchange={ctrl.onchange.bind(ctrl, Feature.enableLeaderboard)}
          />
          <FeatureToggleComponent
            label='Include leaderboard entries of people without scores'
            value={configService.features[Feature.allLeaderboardEntries]}
            onchange={ctrl.onchange.bind(ctrl, Feature.allLeaderboardEntries)}
          />
        </AccordionComponent>
        <AccordionComponent label='PLAYERS'>
          <FeatureToggleComponent
            label='Players must create a custom username their first time playing'
            value={configService.features[Feature.userInfoUsername]}
            onchange={ctrl.onchange.bind(ctrl, Feature.userInfoUsername)}
          />
          <FeatureToggleComponent
            label='Players must enter their first and last names to play'
            value={configService.features[Feature.userInfoName]}
            onchange={ctrl.onchange.bind(ctrl, Feature.userInfoName)}
          />
          <FeatureToggleComponent
            label='Players must enter their email to play'
            value={configService.features[Feature.userInfoEmail]}
            onchange={ctrl.onchange.bind(ctrl, Feature.userInfoEmail)}
          />
          <FeatureToggleComponent
            label='Players can choose whether or not to share collected user data'
            value={configService.features[Feature.userInfoShare]}
            onchange={ctrl.onchange.bind(ctrl, Feature.userInfoShare)}
          />
          <FeatureToggleComponent
            label='Players must confirm their age'
            value={configService.features[Feature.over18]}
            onchange={ctrl.onchange.bind(ctrl, Feature.over18)}
          />
          {configService.features[Feature.over18] && (
            <div class='gc-feature-toggle'>
              <div class='label'>Age Confirmation Value</div>
              <input
                type='number'
                class={`gc-input ${ctrl.gameStarted ? 'disabled' : ''}`}
                value={configService.ageGateValue}
                onblur={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0) {
                    configService.ageGateValue = value;
                  } else {
                    e.target.value = configService.ageGateValue;
                  }
                }}
              />
            </div>
          )}
          {configService.features[Feature.over18] && (
            <div class='gc-feature-toggle' style={{ height: '12vh' }}>
              <div class='label'>Age Confirmation Message</div>
              <textarea
                class={
                  'gc-input gc-textarea disclaimer' +
                  (ctrl.gameStarted ? ' disabled' : '')
                }
                onblur={(e) => (configService.ageGateMessage = e.target.value)}
              >
                {configService.ageGateMessage}
              </textarea>
            </div>
          )}
          {configService.features[Feature.over18] && (
            <FeatureToggleComponent
              label='Players age must be over age confirmation value to play'
              value={configService.features[Feature.over18Required]}
              onchange={ctrl.onchange.bind(ctrl, Feature.over18Required)}
            />
          )}
          {configService.features[Feature.over18] && (
            <FeatureToggleComponent
              label='Players age must be over age confirmation value to receive awards'
              value={configService.features[Feature.softGate]}
              onchange={ctrl.onchange.bind(ctrl, Feature.softGate)}
            />
          )}
          <div class='gc-feature-toggle'>
            <div class='label'>User Name Prefix</div>
            <input
              class={'gc-input' + (ctrl.gameStarted ? ' disabled' : '')}
              value={configService.userNamePrefix}
              oninput={(e) => (configService.userNamePrefix = e.target.value)}
            />
          </div>
          <div class='gc-feature-toggle' style={{ height: '12vh' }}>
            <div class='label'>Opt-in Message</div>
            <textarea
              class={
                'gc-input gc-textarea disclaimer' +
                (ctrl.gameStarted ? ' disabled' : '')
              }
              oninput={(e) => (configService.optInMessage = e.target.value)}
            >
              {configService.optInMessage}
            </textarea>
          </div>
          <div class='gc-feature-toggle'>
            <div class='label'>Rules Url</div>
            <input
              class={'gc-input' + (ctrl.gameStarted ? ' disabled' : '')}
              value={configService.rulesUrl}
              oninput={(e) => (configService.rulesUrl = e.target.value)}
            />
          </div>
        </AccordionComponent>
        <AccordionComponent label='Front Gate'>
          <div class='gc-feature-toggle'>
            <div class='label'>GAME TITLE</div>
            <input
              class={'gc-input' + (ctrl.gameStarted ? ' disabled' : '')}
              value={configService.gameTitle}
              oninput={(e) => (configService.gameTitle = e.target.value)}
            />
          </div>
          <div class='gc-feature-toggle'>
            <div class='label'>SUMMARY BELOW CLOCK</div>
            <input
              class={'gc-input' + (ctrl.gameStarted ? ' disabled' : '')}
              value={configService.summaryBelowClock}
              oninput={(e) =>
                (configService.summaryBelowClock = e.target.value)
              }
            />
          </div>
          <div class='gc-feature-toggle' style={{ height: '12vh' }}>
            <div class='label'>Disclaimer / Rules Summary</div>
            <textarea
              class={
                'gc-input gc-textarea disclaimer' +
                (ctrl.gameStarted ? ' disabled' : '')
              }
              oninput={(e) =>
                (configService.disclamRulesSummary = e.target.value)
              }
            >
              {configService.disclamRulesSummary}
            </textarea>
          </div>
          <div class='gc-feature-toggle'>
            <div class='label'>No Count Down Summary</div>
            <input
              class={'gc-input' + (ctrl.gameStarted ? ' disabled' : '')}
              value={configService.noCountDownSummary}
              oninput={(e) =>
                (configService.noCountDownSummary = e.target.value)
              }
            />
          </div>
        </AccordionComponent>
      </div>
    </div>
  );
}
