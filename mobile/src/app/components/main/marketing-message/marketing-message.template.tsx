import m from 'mithril';
import { MarketingMessageComponent } from './marketing-message.component';
import { isEmptyString } from '../../../../../../common';
import { configService } from '../../../services/config';
import cx from 'classnames';

export function template(ctrl: MarketingMessageComponent) {
    const isText = ctrl.message && !isEmptyString(ctrl.message.text);

    const style: any = {};

    if (isText) {
        style.backgroundColor = configService.colors.secondary;
        style.borderColor = configService.colors.primary;
    } else {
        style.backgroundColor = 'rgba(0, 0, 0, 0)';
        style.borderColor = 'rgba(0, 0, 0, 0)';
    }

    if (ctrl.message) {
        return <div class={cx('gc-marketing-message', { photo: !!ctrl.message.photo })}
            onclick={ctrl.onClick.bind(ctrl)}
            style={style}>
            {isText &&
                <div class='text'
                    style={{ color: configService.colors.text4 }}>
                    {ctrl.message.text}
                </div>}
            {ctrl.message.photo &&
                <img src={ctrl.message.photo.url} />}
        </div>;
    } else {
        return <div class='gc-empty-marketing-message' />;
    }
}
