import {Deferred} from './Deferred';

export class PromiseQueue {
    private readonly _queue: IQueueItem[] = [];
    private _running = 0;

    constructor(private _concurrent: number) {
    }

    public run(fn: () => Promise<any>): Promise<any> {
        const d = new Deferred();

        this._queue.push({
            d,
            fn,
        });

        setTimeout(this.next.bind(this), 0);
        return d.promise;
    }

    private next(): void {
        if (this._running >= this._concurrent || this._queue.length === 0) {
            return;
        }

        const data = this._queue.shift();
        this._running++;
        data.fn().then(result => {
            data.d.resolve(result);
            this.complete();
        }).catch(error => {
            data.d.reject(error);
            this.complete();
        });
    }

    private complete() {
        this._running--;
        this.next();
    }
}

interface IQueueItem {
    d: Deferred;
    fn: () => Promise<any>;
}
