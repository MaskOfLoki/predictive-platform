import { ConfigService } from './ConfigService';
import { IConfig } from '../../../../../common';
import { redraw } from 'mithril';

export enum OutgoingEvents {
    STATE = 'state',
    CONFIG = 'config',
    USER = 'user',
    GAME_DATA = 'game_data',
    RESPONSE = 'response',
}

export interface IMessage {
    id?: number;
    event: OutgoingEvents;
    data?: any;
}

export class XeoConfigService extends ConfigService {
    constructor() {
        super();
        window.addEventListener('message', this.parseMessage.bind(this));
    }

    private parseMessage(event: MessageEvent) {
        const message = event.data as IMessage;

        if (message?.event === OutgoingEvents.CONFIG) {
            this._config.colors = { ...this._config.colors, ...message.data?.colors };
            this.updateFont(this._config.font);
            this.dispatch(this._config);
            redraw();
        }
    }

    protected configHandler(value: IConfig): void {
        redraw();
    }

}
