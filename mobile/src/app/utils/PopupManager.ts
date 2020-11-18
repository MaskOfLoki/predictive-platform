import m from 'mithril';
import MiniSignal from 'mini-signals';
import {AlertPopupComponent} from '../components/alert-popup/alert-popup.component';

export class PopupManager {
    public static show(componentClass: any, attrs: any = {}): Promise<any> {
        return new Promise<any>(resolve => {
            const overlay = document.createElement('div');
            overlay.classList.add('popup-overlay');

            if (!attrs.closePopup) {
                attrs.closePopup = new MiniSignal();
            }

            attrs.closePopup.once(value => {
                overlay.style.animationName = 'fade-out';
                overlay.addEventListener('animationend', () => {
                    m.mount(overlay, null);
                    overlay.remove();
                    resolve(value);
                });
            });

            document.body.appendChild(overlay);
            m.mount(overlay, {view: () => m(componentClass, attrs)});
        });
    }

    public static warning(text: string): Promise<any> {
        return PopupManager.show(AlertPopupComponent, {
            title: 'WARNING',
            text,
            hideCancelButton: true,
        });
    }
}
