import { IGCPubnubConfig } from '../types/IGCPubnubConfig';
import { Unwatch } from '../utils';
// pubnub doesn't work in web worker by default,
// so we use slightly modified web worker compatible version
import PubNub from './misc/pubnub';

export class GCPubNub {
  private _callbacks: Map<string, any[]> = new Map<string, any[]>();
  private _pubnub: IPubNub;
  private _listener = {
    message: this.messageHandler.bind(this),
  };

  constructor(private _config: IGCPubnubConfig) {}

  public init(uuid: string) {
    this.destroy();

    this._pubnub = new PubNub({
      uuid,
      ssl: true,
      ...this._config,
    });

    this._pubnub.addListener(this._listener);
    const channels: string[] = Array.from(this._callbacks.keys());

    if (channels.length) {
      this._pubnub.subscribe({
        channels,
      });
    }
  }
  public publish(message: IPubNubMessage): Promise<void> {
    return this._pubnub.publish(message);
  }

  public subscribe<T>(
    options: { channel: string; withPresence?: boolean },
    callback: (value: T) => void,
  ): Unwatch {
    const channel = options.channel;
    let callbacks = this._callbacks.get(channel);

    if (callbacks) {
      callbacks.push(callback);
    } else {
      callbacks = [callback];

      if (this._pubnub) {
        this._pubnub.subscribe({
          channels: [channel],
          withPresence: options.withPresence,
        });
      }

      this._callbacks.set(channel, callbacks);
    }

    return () => {
      const callbacks = this._callbacks.get(channel);

      if (!callbacks) {
        return;
      }

      const index = callbacks.indexOf(callback);

      if (index !== -1) {
        callbacks.splice(index, 1);
      }

      if (callbacks.length === 0) {
        this._callbacks.delete(channel);
        this._pubnub.unsubscribe({
          channels: [channel],
        });
      }
    };
  }

  private messageHandler(m: IPubNubMessage) {
    const callbacks = this._callbacks.get(m.channel);

    if (callbacks) {
      callbacks.forEach((callback) => callback(m.message));
    }
  }

  public destroy() {
    if (!this._pubnub) {
      return;
    }

    this._pubnub.unsubscribeAll();
    this._pubnub.removeListener(this._listener);
    this._pubnub.stop();
    this._pubnub = undefined;
  }

  public async time(): Promise<number> {
    const { timetoken } = await this._pubnub.time();
    return timetoken;
  }

  public hereNow(options: {
    channels?: string[];
    channelGroups?: string[];
    includeUUIDs?: boolean;
  }): Promise<IHereNowResponse> {
    return this._pubnub.hereNow(options);
  }

  public addChannelsToGroup(channels: string[], channelGroup: string) {
    return this._pubnub.channelGroups.addChannels({
      channels,
      channelGroup,
    });
  }

  public async listChannels(channelGroup: string): Promise<string[]> {
    const { channels } = await this._pubnub.channelGroups.listChannels({
      channelGroup,
    });
    return channels;
  }

  public removeChannelsFromGroup(channels: string[], channelGroup: string) {
    return this._pubnub.channelGroups.removeChannels({
      channels,
      channelGroup,
    });
  }
}

interface IPubNub {
  channelGroups: {
    addChannels(options: { channels: string[]; channelGroup: string });
    listChannels(options: { channelGroup: string });
    removeChannels(options: { channels: string[]; channelGroup: string });
  };
  subscribe(options: { channels: string[]; withPresence?: boolean }): void;

  publish(message: IPubNubMessage);

  unsubscribe(options: { channels: string[] }): void;

  unsubscribeAll(): void;

  addListener(listener: IPubNubListener): void;

  removeListener(listener: IPubNubListener): void;

  stop(): void;

  time();

  hereNow(options: {
    channels?: string[];
    channelGroups?: string[];
    includeUUIDs?: boolean;
  });
}

interface IPubNubListener {
  message: (value: IPubNubMessage) => void;
}

interface IPubNubMessage {
  channel: string;
  message: any;
}

interface IHereNowResponse {
  totalChannels: number;
  totalOccupancy: number;
  channels: any;
}
