export function formatPhone(value: string): string {
    return `+${value.charAt(0)}-${value.substr(1, 3)}-${value.substr(4, 3)}-${value.substr(7, 4)}`;
}

export interface IProgress {
    current: number;
    total: number;
}

export type ProgressCallback = (progress: IProgress) => void;
