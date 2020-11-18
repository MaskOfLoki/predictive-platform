import {ProgressCallback} from '../utils';
import Noty from 'noty';

class ProgressService {
    public start(label: string, template?: string): ProgressCallback {
        if (!template) {
            template = label;
        }

        const noty = new Noty({
            text: label,
            type: 'warning',
            layout: 'bottomRight',
        });

        noty.show();

        return progress => {
            const text = template
                .replace('{current}', progress.current.toString())
                .replace('{total}', progress.total.toString());
            noty.setText(text);
            if (progress.current === progress.total) {
                setTimeout(noty.close.bind(noty), 1000);
            }
        };
    }
}

export const progressService: ProgressService = new ProgressService();
