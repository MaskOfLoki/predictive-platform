import m from 'mithril';

import { FeatureFlags } from '../../../../../../../feature-flags';
import { FeatureSettingsComponent } from './feature-settings/feature-settings.component';
import { MainboardSettingsComponent } from './mainboard-settings/mainboard-settings.component';
import { SettingsPopupComponent } from './settings-popup.component';
import { SmsNotificationSettingsComponent } from './sms-notification-settings/sms-notification-settings.component';
import { TermsOfServiceSettingsComponent } from './terms-of-service-settings/terms-of-service-settings.component';
import { UiSettingsComponent } from './ui-settings/ui-settings.component';

export function template(ctrl: SettingsPopupComponent) {
    let smsClasses = 'tab';
    if (!FeatureFlags.SMSBulkNotification) {
        smsClasses += ' disabled';
    }

    return (
        <div class='gc-settings-popup'>
            <div class='header'>
                <div class='left'>
                    SETTINGS
                </div>
                <div class='right'>
                    <div class='button'
                         onclick={ctrl.buttonCloseHandler.bind(ctrl)}>X
                    </div>
                </div>
            </div>
            <div class='group-tabs'>
                <div class={`tab${ctrl.selectedTab === 0 ? ' active' : ''}`}
                     onclick={() => ctrl.selectedTab = 0}>
                    UI
                </div>
                <div class={`tab${ctrl.selectedTab === 1 ? ' active' : ''}`}
                     onclick={() => ctrl.selectedTab = 1}>
                    MAINBOARD
                </div>
                <div
                    class={`${smsClasses}${ctrl.selectedTab === 2 ? ' active' : ''}`}
                     onclick={() => { if (FeatureFlags.SMSBulkNotification) { ctrl.selectedTab = 2; }}}>
                    SMS NOTIFICATION
                </div>
                <div class={`tab${ctrl.selectedTab === 3 ? ' active' : ''}`}
                     onclick={() => ctrl.selectedTab = 3}>
                    TERMS OF SERVICE
                </div>
                <div class={`tab${ctrl.selectedTab === 4 ? ' active' : ''}`}
                     onclick={() => ctrl.selectedTab = 4}>
                    FEATURES
                </div>
            </div>
            {ctrl.selectedTab === 0 && <UiSettingsComponent/>}
            {ctrl.selectedTab === 1 && <MainboardSettingsComponent/>}
            {ctrl.selectedTab === 2 && <SmsNotificationSettingsComponent/>}
            {ctrl.selectedTab === 3 && <TermsOfServiceSettingsComponent/>}
            {ctrl.selectedTab === 4 && <FeatureSettingsComponent gameStarted={ctrl.gameStarted}/>}
        </div>
    );
}
