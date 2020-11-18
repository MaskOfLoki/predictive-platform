import m from 'mithril';
import {HeaderComponent} from './header.component';

export function template(ctrl: HeaderComponent) {
    return (
        <div class='gc-header'>
            <div class='group-logo'>
                <div class='logo'/>
            </div>
            <div class='title'>PGP ADMIN PANEL</div>
            <div class='spacer'/>
            <div class='user-count'>{ctrl.userCount} USERS ONLINE</div>
            <div class='settings' onclick={ctrl.buttonSettingsHandler.bind(ctrl)}/>
        </div>
    );
}
