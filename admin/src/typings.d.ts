declare const GC_PRODUCTION: boolean;
declare const ENVIRONMENT: string;

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}
