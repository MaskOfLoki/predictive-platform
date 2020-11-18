import m from 'mithril';
import { UiSettingsComponent } from './ui-settings.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { LogoSelectorComponent } from '../../../questions-panel/logo-selector/logo-selector.component';
import { ToggleComponent } from '../../../toggle/toggle.component';
import { MobilePreviewComponent } from './mobile-preview/mobile-preview.component';
import { FontPickerComponent } from '../font-picker/font-picker.component';

export function template(ctrl: UiSettingsComponent) {
  return (
    <div class='gc-ui-settings'>
      <div class='content'>
        <div class='column'>
          <ColorPickerComponent
            label='PRIMARY COLOR'
            color={ctrl.colors.primary}
            onchange={(color) => (ctrl.colors.primary = color)}
          />
          <ColorPickerComponent
            label='SECONDARY COLOR'
            color={ctrl.colors.secondary}
            onchange={(color) => (ctrl.colors.secondary = color)}
          />
          <ColorPickerComponent
            label='TERTIARY COLOR'
            color={ctrl.colors.tertiary}
            onchange={(color) => (ctrl.colors.tertiary = color)}
          />
          <ColorPickerComponent
            label='TEXT 1 COLOR'
            color={ctrl.colors.text1}
            onchange={(color) => (ctrl.colors.text1 = color)}
          />
          <ColorPickerComponent
            label='TEXT 2 COLOR'
            color={ctrl.colors.text2}
            onchange={(color) => (ctrl.colors.text2 = color)}
          />
          <ColorPickerComponent
            label='TEXT 3 COLOR'
            color={ctrl.colors.text3}
            onchange={(color) => (ctrl.colors.text3 = color)}
          />
          <ColorPickerComponent
            label='TEXT 4 COLOR'
            color={ctrl.colors.text4}
            onchange={(color) => (ctrl.colors.text4 = color)}
          />
          <ColorPickerComponent
            label='TEXT 5 COLOR'
            color={ctrl.colors.text5}
            onchange={(color) => (ctrl.colors.text5 = color)}
          />
          <ColorPickerComponent
            label='TEXT 6 COLOR'
            color={ctrl.colors.text6}
            onchange={(color) => (ctrl.colors.text6 = color)}
          />
          <ColorPickerComponent
            label='INCORRECT COLOR'
            color={ctrl.colors.incorrect}
            onchange={(color) => (ctrl.colors.incorrect = color)}
          />
          <ColorPickerComponent
            label='CORRECT COLOR'
            color={ctrl.colors.correct}
            onchange={(color) => (ctrl.colors.correct = color)}
          />
          <ColorPickerComponent
            label='PUSHED COLOR'
            color={ctrl.colors.pushed}
            onchange={(color) => (ctrl.colors.pushed = color)}
          />
          <ColorPickerComponent
            label='PENDING/LOCKED COLOR'
            color={ctrl.colors.pending}
            onchange={(color) => (ctrl.colors.pending = color)}
          />
          <ToggleComponent
            label='DISABLE SET LEADERBOARD'
            selected={ctrl.config.disabledSetLeaderboard}
            onchange={(value) => (ctrl.config.disabledSetLeaderboard = value)}
          />
          <ToggleComponent
            label='DISABLE DAILY LEADERBOARD'
            selected={ctrl.config.disabledDailyLeaderboard}
            onchange={(value) => (ctrl.config.disabledDailyLeaderboard = value)}
          />
        </div>
        <div class='column'>
          <MobilePreviewComponent config={ctrl.config} />
        </div>
        <div class='column'>
          <div class='row'>
            <LogoSelectorComponent
              label='LOGO'
              image={ctrl.config.logo}
              onchange={(value) => (ctrl.config.logo = value)}
            />
            <LogoSelectorComponent
              label='POPUP'
              description='512 x 512 png format'
              image={ctrl.config.popup}
              onchange={(value) => (ctrl.config.popup = value)}
            />
          </div>
          <div class='row'>
            <LogoSelectorComponent
              label='BACKGROUND'
              description='1080 x 1920 png format'
              image={ctrl.config.background}
              onchange={(value) => (ctrl.config.background = value)}
            />
            <LogoSelectorComponent
              label='GAME OVER'
              image={ctrl.config.gameOverImage}
              onchange={(value) => (ctrl.config.gameOverImage = value)}
            />
          </div>
          <div class='group-input'>
            <div class='label'>SOURCE EMAIL</div>
            <input
              class='gc-input'
              value={ctrl.config.email}
              oninput={(e) => (ctrl.config.email = e.target.value)}
            />
          </div>
          <div class='group-input'>
            <div class='label'>EMAIL PASSWORD</div>
            <input
              class='gc-input'
              type='password'
              value={ctrl.emailPassword}
              oninput={(e) => (ctrl.emailPassword = e.target.value)}
            />
          </div>
          <div class='group-input'>
            <div class='label'>GAME OVER TITLE</div>
            <input
              class='gc-input'
              value={ctrl.config.gameOverTitle}
              oninput={(e) => (ctrl.config.gameOverTitle = e.target.value)}
            />
          </div>
          <div class='group-input'>
            <div class='label'>GAME OVER SUBTITLE</div>
            <input
              class='gc-input'
              value={ctrl.config.gameOverSubtitle}
              oninput={(e) => (ctrl.config.gameOverSubtitle = e.target.value)}
            />
          </div>
          <FontPickerComponent
            font={ctrl.config.font}
            onchange={(value) => {
              if (value) {
                ctrl.config.font = value;
              } else {
                ctrl.config.font = null;
              }
            }}
          />
        </div>
      </div>
      <div class='buttons'>
        <div class='button' onclick={ctrl.buttonResetHandler.bind(ctrl)}>
          RESET
        </div>
        <div class='line' />
        <div class='button' onclick={ctrl.buttonActivateHandler.bind(ctrl)}>
          ACTIVATE
        </div>
      </div>
    </div>
  );
}
