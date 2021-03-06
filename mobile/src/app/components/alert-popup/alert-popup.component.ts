import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import {template} from './alert-popup.template';
import './alert-popup.component.scss';
import * as MiniSignal from 'mini-signals';

export interface IAlertAttrs {
    closePopup: MiniSignal;
    title: string;
    text: string;
    input: string;
    inputPlaceholder: string;
    buttonConfirmText: string;
    hideCancelButton: boolean;
}

export class AlertPopupComponent implements ClassComponent<IAlertAttrs> {
    private _closePopup: MiniSignal;
    private _title: string;
    private _text: string;
    private _buttonConfirmText = 'OK';
    private _input: string;
    private _inputPlaceholder: string;
    private _element: HTMLElement;
    private _hideCancelButton: boolean;

    public oninit(vnode: Vnode<IAlertAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._title = vnode.attrs.title;
        this._text = vnode.attrs.text;
        this._input = vnode.attrs.input;
        this._inputPlaceholder = vnode.attrs.inputPlaceholder;
        this._hideCancelButton = vnode.attrs.hideCancelButton;

        if (vnode.attrs.buttonConfirmText) {
            this._buttonConfirmText = vnode.attrs.buttonConfirmText;
        }
    }

    public oncreate(vnode: VnodeDOM<IAlertAttrs, this>) {
        this._element = vnode.dom as HTMLElement;
    }

    public buttonCancelHandler(): void {
        this._closePopup.dispatch();
    }

    public buttonConfirmHandler(): void {
        if (this._input) {
            this._closePopup.dispatch(this._element.querySelector('input').value);
        } else {
            this._closePopup.dispatch(true);
        }
    }

    public view() {
        return template(this);
    }

    public get title(): string {
        return this._title;
    }

    public get text(): string {
        return this._text;
    }

    public get buttonConfirmText(): string {
        return this._buttonConfirmText;
    }

    public get input(): string {
        return this._input;
    }

    public get inputPlaceholder(): string {
        return this._inputPlaceholder;
    }

    public get hideCancelButton(): boolean {
        return this._hideCancelButton;
    }
}
