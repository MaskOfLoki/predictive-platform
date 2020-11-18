import m from 'mithril';
import {HomeScreenComponent} from './home-screen.component';

export function template(ctrl: HomeScreenComponent) {
    return (
        <div class='home-screen'>
            <div class='group-buttons'>
                <a class='gc-button' href='#!/home/how-to' style={{
                    backgroundColor: ctrl.config.colors.secondary,
                    color: ctrl.config.colors.text4,
                    ...ctrl.fontStyle,
                }}>
                    HOW TO PLAY
                </a>
                {ctrl.config.terms &&
                <a class='gc-button' href='#!/home/terms' style={{
                    backgroundColor: ctrl.config.colors.secondary,
                    color: ctrl.config.colors.text4,
                    ...ctrl.fontStyle,
                }}>
                    TERMS &amp; CONDITIONS
                </a>}
                <a class='gc-button' href='#!/home/my-wins' style={{
                    backgroundColor: ctrl.config.colors.secondary,
                    color: ctrl.config.colors.text4,
                    ...ctrl.fontStyle,
                }}>
                    MY WINS
                </a>
            </div>
        </div>
    );
}
