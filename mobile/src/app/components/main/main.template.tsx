import m, { Vnode } from 'mithril';
import { HeaderComponent } from './header/header.component';
import { configService } from '../../services/config';

export function template(vnode: Vnode) {
    const style: any = {};

    if (configService.background) {
        style.backgroundImage = `url(${configService.background.url})`;
    } else {
        style.backgroundColor = configService.colors.tertiary;
    }

    return (
        <div class='main-screen' style={style}>
            <HeaderComponent />
            <div class='main-content'>
                {vnode.children}
            </div>
        </div>
    );
}
