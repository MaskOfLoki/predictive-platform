import {configService} from './ConfigService';
import {delay} from '@gamechangerinteractive/gc-firebase/utils';
import {isEmptyString} from '../../../../../common';

class EmailService {
    private _batchSize = 10;
    private _queue: IQueueItem[] = [];
    private _isSending: boolean;

    public send(emails: string[], text: string, subject: string, file?: string) {
        this._queue = this._queue.concat(emails.map(email => {
            return {
                email,
                text,
                subject,
                file,
            };
        }));

        this.sendNextBatch();
    }

    private async sendNextBatch() {
        if (this._queue.length === 0 || this._isSending) {
            return;
        }

        this._isSending = true;
        const batch: IQueueItem[] = this._queue.splice(0, this._batchSize);
        await Promise.all(
            batch.map(item => this.sendSingle(item.email, item.text, item.subject, item.file)
                .catch(e => console.warn('EmailService.sendSingle', e))),
        );

        await delay(20);
        this._isSending = false;
        this.sendNextBatch();
    }

    private async sendSingle(to: string, text: string, subject: string, file?: string): Promise<void> {
        const data: any = {
            user: configService.email,
            pass: localStorage.getItem('gc.email.validation'),
            to,
            subject,
            text,
        };

        if (!isEmptyString(file)) {
            data.files = [file];
        }

        // return gmailSend(data)();
    }
}

interface IQueueItem {
    email: string;
    text: string;
    subject: string;
    file: string;
}

export const email: EmailService = new EmailService();
