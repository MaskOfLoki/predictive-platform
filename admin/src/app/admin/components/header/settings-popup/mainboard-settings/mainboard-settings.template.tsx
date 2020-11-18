import m from 'mithril';
import {MainboardSettingsComponent} from './mainboard-settings.component';
import {LeadersListComponent} from './leaders-list/leaders-list.component';
import {ToggleComponent} from '../../../toggle/toggle.component';
import {MainboardLayout} from '../../../../../utils';
import {LeaderboardType} from '../../../../../../../../common';
import {LogoSelectorComponent} from '../../../questions-panel/logo-selector/logo-selector.component';
import {ColorPickerComponent} from '../color-picker/color-picker.component';

export function template(ctrl: MainboardSettingsComponent) {
    return (
        <div class='gc-mainboard-settings'>
            <LeadersListComponent type={ctrl.leaderboardType}/>
            <div class='column'>
                <ToggleComponent label='FULLSCREEN'
                                 type='radio'
                                 selected={ctrl.layout === MainboardLayout.FULLSCREEN}
                                 onchange={ctrl.layoutChangeHandler.bind(ctrl, MainboardLayout.FULLSCREEN)}/>
                <ToggleComponent label='SIDE SLAB'
                                 type='radio'
                                 selected={ctrl.layout === MainboardLayout.SIDE_SLAB}
                                 onchange={ctrl.layoutChangeHandler.bind(ctrl, MainboardLayout.SIDE_SLAB)}/>
                <ToggleComponent label='LOWER THIRD'
                                 type='radio'
                                 selected={ctrl.layout === MainboardLayout.LOWER_THIRD}
                                 onchange={ctrl.layoutChangeHandler.bind(ctrl, MainboardLayout.LOWER_THIRD)}/>
                <div class='spacer'/>
                <ToggleComponent label='OVERALL'
                                 type='radio'
                                 selected={ctrl.leaderboardType === LeaderboardType.OVERALL}
                                 onchange={() => ctrl.leaderboardType = LeaderboardType.OVERALL}/>
                <ToggleComponent label='DAILY'
                                 type='radio'
                                 selected={ctrl.leaderboardType === LeaderboardType.DAILY}
                                 onchange={() => ctrl.leaderboardType = LeaderboardType.DAILY}/>
                <ToggleComponent label='SET'
                                 type='radio'
                                 selected={ctrl.leaderboardType === LeaderboardType.SET}
                                 onchange={() => ctrl.leaderboardType = LeaderboardType.SET}/>
                <LogoSelectorComponent label='TITLE IMAGE'
                            description='RATIO 12:1'
                            image={ctrl.config.titleImage}
                            onchange={value => ctrl.config.titleImage = value}/>
            </div>
            <div class='line'/>
            <div class='group-ui'>
                <div class='row'>
                    <div class='column'>
                        <LogoSelectorComponent label='BACKGROUND'
                                               description=' '
                                               image={ctrl.config.backgroundImage}
                                               onchange={value => ctrl.config.backgroundImage = value}/>
                        <LogoSelectorComponent label='LOGO'
                                               description=' '
                                               image={ctrl.config.logo}
                                               onchange={value => ctrl.config.logo = value}/>
                    </div>
                    <div class='column'>
                        <ColorPickerComponent label='BACKGROUND COLOR'
                                              color={ctrl.config.backgroundColor}
                                              onchange={value => ctrl.config.backgroundColor = value}/>
                        <ColorPickerComponent label='TEXT COLOR'
                                              color={ctrl.config.textColor}
                                              onchange={value => ctrl.config.textColor = value}/>
                        <ColorPickerComponent label='HEADER BAR COLOR'
                                              color={ctrl.config.headerBarColor}
                                              onchange={value => ctrl.config.headerBarColor = value}/>
                        <ColorPickerComponent label='ODD BARS COLOR'
                                              color={ctrl.config.oddBarsColor}
                                              onchange={value => ctrl.config.oddBarsColor = value}/>
                        <ColorPickerComponent label='EVEN BARS COLOR'
                                              color={ctrl.config.evenBarsColor}
                                              onchange={value => ctrl.config.evenBarsColor = value}/>
                        <div class='group-input'>
                            <div class='label'>TITLE</div>
                            <input class='gc-input'
                                    value={ctrl.config.title}
                                    oninput={e => ctrl.config.title = e.target.value}/>
                        </div>
                    </div>
                </div>
                <div class='row'>
                    <div class='gc-button'
                         onclick={ctrl.buttonResetHandler.bind(ctrl)}>
                        RESET
                    </div>
                    <div class='gc-button'
                         onclick={ctrl.buttonActivateHandler.bind(ctrl)}>
                        ACTIVATE
                    </div>
                </div>
            </div>
        </div>
    );
}
