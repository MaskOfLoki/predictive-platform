export class Deferred {
    private _resolve: any;
    private _reject: any;
    public readonly promise: Promise<any>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public get resolve(): any {
        return this._resolve;
    }

    public get reject(): any {
        return this._reject;
    }
}
