import {ClassComponent, Vnode} from 'mithril';
import {template} from './marketing-message-popup.template';
import './marketing-message-popup.component.scss';
import {IMarketingMessage, isEmptyString} from '../../../../../../../common';
import * as MiniSignal from 'mini-signals';
import {IGCFileData} from '@gamechangerinteractive/gc-firebase';
import {fileService} from '../../../services/FileService';
import m from 'mithril';
import {PopupManager} from '../../../utils/PopupManager';

interface IMarketingMessageAttrs {
    message: IMarketingMessage;
    closePopup: MiniSignal;
}

export class MarketingMessagePopupComponent implements ClassComponent<IMarketingMessageAttrs> {
    private _closePopup: MiniSignal;
    private _message: IMarketingMessage;

    public isImage: boolean;

    public text: string;
    public photo: IGCFileData;
    public redirectUrl: string = '';
    public timer: number;

    public oninit(vnode: Vnode<IMarketingMessageAttrs, this>): any {
        this._closePopup = vnode.attrs.closePopup;
        this._message = vnode.attrs.message;

        if (this._message) {
            this.text = this._message.text;
            this.photo = this._message.photo;
            this.redirectUrl = this._message.redirectUrl || '';
            this.timer = this._message.timer;
            this.isImage = isEmptyString(this.text);
        } else {
            this._message = {
                timer: 30,
            };
            this.timer = this._message.timer;
        }
    }

    public async buttonPhotoHandler() {
        const photo: IGCFileData = await fileService.selectAndUploadImage(['jpg', 'jpeg', 'png', 'gif']);

        if (photo) {
            // Make sure any images uploaded before saving are deleted properly
            if (this.photo && (!this._message.photo || this.photo.path !== this._message.photo.path)) {
                fileService.removeFile(this.photo);
            }
            this.photo = photo;
            m.redraw();
        }
    }

    public buttonSaveMessageHandler() {
        if (!this.validate()) {
            return;
        }

        this._message.text = this.text;
        // Make sure if we are replacing or removing an image, that the image gets removed correctly
        if (this._message.photo && (!this.photo || this._message.photo.path !== this.photo.path)) {
            fileService.removeFile(this._message.photo);
        }
        this._message.photo = this.photo;
        this._message.redirectUrl = this.redirectUrl.trim();
        this._message.timer = this.timer;

        if (this.isImage) {
            delete this._message.text;
        } else {
            delete this._message.photo;
        }

        this._closePopup.dispatch(this._message);
    }

    public buttonHelpHandler() {
        PopupManager.warning(`
            Recommend that images on marketing images are all the same aspect ratio.
            <br/><br/>
            Image size can push questions down on screen, requiring scrolling.
            <br/><br>
            High definition images can slow down loading times for mobile users
        `, 'HELP');
    }

    public buttonCancelHandler() {
        // Make sure any images uploaded before saving are deleted properly
        if (this.photo && (!this._message.photo || this.photo.path !== this._message.photo.path)) {
            fileService.removeFile(this.photo);
        }
        this._closePopup.dispatch();
    }

    private validate(): boolean {
        if (this.isImage && !this.photo) {
            PopupManager.warning('Please, upload the photo');
            return false;
        }

        if (!this.isImage && isEmptyString(this.text)) {
            PopupManager.warning('Please, provide message text');
            return false;
        }

        if (isNaN(this.timer) || this.timer <= 0) {
            PopupManager.warning('Please, provide valid timer value');
            return false;
        }

        if (!isEmptyString(this.redirectUrl) && this.redirectUrl.trim().search(/https?:\/\/.+/) !== 0) {
            PopupManager.warning('Please enter a valid redirect url or leave it blank');
            return false;
        }

        return true;
    }

    public view() {
        return template(this);
    }

    public get message(): IMarketingMessage {
        return this._message;
    }
}
