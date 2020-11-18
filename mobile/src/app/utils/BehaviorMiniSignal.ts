import * as MiniSignal from 'mini-signals';

export class BehaviorMiniSignal extends MiniSignal {
    private _args: any[];

    constructor(...args: any[]) {
        super();
        this._args = args;
    }

    public add(fn, thisArg?: any): MiniSignal.MiniSignalBinding {
        const result = super.add(fn, thisArg);
        requestAnimationFrame(() => {
            const handlers = this.handlers() as MiniSignal.MiniSignalBinding[];

            if (handlers.indexOf(result) !== -1) {
                fn.apply(thisArg, this._args);
            }
        });
        return result;
    }

    public once(fn, thisArg?: any): MiniSignal.MiniSignalBinding {
        console.warn('BehaviorMiniSignal.once is not supported');
        return null;
    }

    public dispatch(...args: any[]): boolean {
        this._args = args;
        return super.dispatch(...args);
    }
}
