import m from 'mithril';
import { HomeComponent } from './home.component';
import { MarketingMessageComponent } from '../marketing-message/marketing-message.component';
import { configService } from '../../../services/config';
import cx from 'classnames';

export function template(ctrl: HomeComponent) {
    return (
        <div class={cx('home-screen', { 'not-started': !ctrl.isStarted })}>
            {ctrl.isStarted && <MarketingMessageComponent />}
            <div class='group-buttons'>
                <a class='gc-button'
                    href='#!/home/how-to'
                    style={{
                        backgroundColor: configService.colors.secondary,
                        color: configService.colors.text4,
                        ...configService.fontStyle,
                    }}>
                    HOW TO PLAY
                </a>
                {configService.terms &&
                    <a class='gc-button'
                        href='#!/terms'
                        style={{
                            backgroundColor: configService.colors.secondary,
                            color: configService.colors.text4,
                            ...configService.fontStyle,
                        }}>
                        TERMS & CONDITIONS
                </a>}
                <a class='gc-button'
                    href='#!/home/my-wins'
                    style={{
                        backgroundColor: configService.colors.secondary,
                        color: configService.colors.text4,
                        ...configService.fontStyle,
                    }}>
                    MY WINS
                </a>
                {
                    configService.rulesUrl && (
                        <a class='gc-button'
                            href={configService.rulesUrl}
                            style={{
                                backgroundColor: configService.colors.secondary,
                                color: configService.colors.text4,
                                ...configService.fontStyle,
                            }}>
                            RULES
                        </a>
                    )
                }
                <div class='gc-button'
                    style={{
                        backgroundColor: configService.colors.secondary,
                        color: configService.colors.text4,
                        ...configService.fontStyle,
                    }}
                    onclick={ctrl.buttonLogoutHandler.bind(ctrl)}>
                    LOGOUT
                </div>
            </div>
        </div>
    );
}
