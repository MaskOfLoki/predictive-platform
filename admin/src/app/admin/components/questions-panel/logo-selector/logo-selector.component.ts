import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import {template} from './logo-selector.template';
import './logo-selector.component.scss';
import {fileService} from '../../../services/FileService';
import {IGCFileData} from '@gamechangerinteractive/gc-firebase';
import m from 'mithril';

interface ILogoAttrs {
    label: string;
    onchange: (image: IGCFileData) => void;
    image: IGCFileData;
    description: string;
}

export class LogoSelectorComponent implements ClassComponent<ILogoAttrs> {
    private _label = '';
    private _image: IGCFileData = null;
    private _description: string;
    private _onchange: (image: IGCFileData) => void;

    public oninit(vnode: Vnode<ILogoAttrs, this>) {
        this._onchange = vnode.attrs.onchange;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<ILogoAttrs, this>) {
        if (vnode.attrs.label) {
            this._label = vnode.attrs.label;
        }

        if (this._image !== vnode.attrs.image) {
            this._image = vnode.attrs.image;
        }

        this._description = vnode.attrs.description || '256 x 256 png format';
    }

    public oncreate(vnode: VnodeDOM<ILogoAttrs, this>) {
        const imageElement: HTMLElement = (vnode.dom as HTMLElement).querySelector('.image');
        imageElement.style.height = `${imageElement.offsetWidth}px`;
    }

    public async buttonUploadClearHandler() {
        if (this._image && this._image.path) {
            try {
                fileService.removeFile(this._image);
            } catch (e) {
                console.error(e);
            }
            this._image = null;
            if (this._onchange) {
                this._onchange(this._image);
            }
            m.redraw();
            return;
        }

        const file: IGCFileData = await fileService.selectAndUploadImage();

        if (!file) {
            return;
        }

        this._image = file;

        if (this._onchange) {
            this._onchange(file);
        }

        m.redraw();
    }

    public view() {
        return template(this);
    }

    public get label() {
        return this._label;
    }

    public get image(): IGCFileData {
        return this._image;
    }

    public get description(): string {
        return this._description;
    }
}
