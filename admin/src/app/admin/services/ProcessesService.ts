class ProcessesService {
    private _processes: Map<Process, boolean> = new Map();

    public start<T>(process: Process, promise?: Promise<T>) {
        this._processes.set(process, true);

        if (promise) {
            return promise.then(result => {
                this.stop(process);
                return result;
            }, error => {
                this.stop(process);
                throw error;
            });
        }
    }

    public stop(process: Process) {
        this._processes.delete(process);
    }

    public isRunning(process?: Process | Process[]): boolean {
        if (!process) {
            return this._processes.size > 0;
        }

        if (!Array.isArray(process)) {
            process = [process];
        }

        return process.some(item => this._processes.has(item));
    }
}

export const processes: ProcessesService = new ProcessesService();

export enum Process {
    AWARD = 'award',
    RESET = 'reset',
}
