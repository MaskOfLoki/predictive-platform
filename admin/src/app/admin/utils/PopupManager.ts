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
                overlay.style.animationName = 'tween-hide';
                overlay.addEventListener('animationend', () => {
                    overlay.remove();
                    resolve(value);
                    m.redraw();
                });
            });

            document.body.appendChild(overlay);
            m.mount(overlay, {view: () => m(componentClass, attrs)});
            setTimeout(() => m.redraw(), 500);
        });
    }

    public static warning(text: string, title: string = 'WARNING'): Promise<any> {
        return PopupManager.show(AlertPopupComponent, {
            title,
            text,
            hideCancelButton: true,
        });
    }

    public static confirm(text: string, buttonConfirmText: string = 'CONFIRMED'): Promise<any> {
        return PopupManager.show(AlertPopupComponent, {
            title: 'CONFIRM',
            text,
            buttonConfirmText,
        });
    }
}
