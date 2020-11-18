import m from 'mithril';
import {MarketingMessageComponent} from './marketing-message.component';

export function template(ctrl: MarketingMessageComponent) {
    return (
      <div class='gc-mobile-marketing-message'
        style={{
            backgroundColor: ctrl.config.colors.secondary,
            borderColor: ctrl.config.colors.primary,
            }}>
        <div class='text'
          style={{color: ctrl.config.colors.text4}}>
          Marketing message text goes here
        </div>
      </div>
    );
}