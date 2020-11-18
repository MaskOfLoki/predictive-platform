import {template} from './banner-image.template';
import './banner-image.component.scss';
import {IBannerQuestion, isEmptyString, QuestionType} from '../../../../../../../../../common';
import m, {ClassComponent, Vnode} from 'mithril';
import * as MiniSignal from 'mini-signals';
import {IGCFileData} from '@gamechangerinteractive/gc-firebase';
import {uuid} from '@gamechangerinteractive/gc-firebase/utils';
import {fileService} from '../../../../../services/FileService';
import {PopupManager} from '../../../../../utils/PopupManager';

interface IBannerImageAttrs {
    question?: IBannerQuestion;
    closePopup: MiniSignal;
}

export class BannerImagePopupComponent implements ClassComponent<IBannerImageAttrs> {
    private _closePopup: MiniSignal;
    private _fileData: IGCFileData;

    public question: IBannerQuestion = {
        id: uuid(),
        type: QuestionType.BANNER_IMAGE,
        banner: {
            path: '',
            url: '',
        },
        redirectUrl: '',
        title: 'BANNER - Image',
    };

    public redirectUrl: string = '';

    public oninit(vnode: Vnode<IBannerImageAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;

        if (vnode.attrs.question) {
            this.question = vnode.attrs.question;
        }
        this.redirectUrl = this.question.redirectUrl || '';
        this._fileData = {
            path: this.question.banner.path,
            url: this.question.banner.url,
        };
    }

    public buttonCancelHandler(): void {
        if (this._fileData.path !== '') {
            if (!this.question || (this.question && this.question.banner.path !== this._fileData.path)) {
                fileService.removeFile(this._fileData);
            }
        }
        this._closePopup.dispatch();
    }

    public validate(): boolean {
        if (isEmptyString(this._fileData.path)) {
            PopupManager.warning('Please upload an image');
            return false;
        }

        if (!isEmptyString(this.redirectUrl) && this.redirectUrl.trim().search(/https?:\/\/.+/) !== 0) {
            PopupManager.warning('Please enter a valid redirect url or leave it blank');
            return false;
        }

        return true;
    }

    public buttonConfirmHandler(): void {
        if (!this.validate()) {
            return;
        }

        this.question.banner = this._fileData;
        this.question.redirectUrl = this.redirectUrl;
        this._closePopup.dispatch(this.question);
    }

    public async buttonChangeHandler(): Promise<void> {
        const file: IGCFileData = await fileService.selectAndUploadImage(['jpg', 'png']);

        if (!file) {
            return;
        }

        if (this._fileData.path !== '' && this.question && this.question.banner.path !== this._fileData.path) {
            fileService.removeFile(this._fileData);
        }

        this._fileData = file;
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public get url(): string {
        return this._fileData ? this._fileData.url : '';
    }

}
