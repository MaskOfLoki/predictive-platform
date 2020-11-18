import {ClassComponent, Vnode} from 'mithril';
import MiniSignal from 'mini-signals';
import {api} from '../../services/api';
import {template} from './data-capture-popup.template';
import {PopupManager} from '../../utils/PopupManager';
import {AlertPopupComponent} from '../alert-popup/alert-popup.component';

import './data-capture-popup.style.scss';
import {IGCAwardedCoupon} from '@gamechangerinteractive/gc-firebase/data/IGCAwardedCoupon';

interface IDataCapturePopupAttrs {
    closePopup: MiniSignal;
    coupon: IGCAwardedCoupon;
}

// tslint:disable-next-line: max-line-length
const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export class DataCapturePopupComponent implements ClassComponent<IDataCapturePopupAttrs> {
    private _closePopup: MiniSignal;
    private _coupon: IGCAwardedCoupon;

    public name = '';
    public email = '';
    public phone = '';

    public oninit(vnode: Vnode<IDataCapturePopupAttrs, this>) {
        this._closePopup = vnode.attrs.closePopup;
        this._coupon = vnode.attrs.coupon;
    }

    public async onAccept(): Promise<void> {
        const dataCaptured: any = {
            rejected: false,
        };

        if (this.captureName) {
            if (this.name.trim() === '') {
                PopupManager.show(AlertPopupComponent, {
                    title: 'Please enter your name',
                    hideCancelButton: true,
                });
                return;
            } else {
                dataCaptured.name = this.name;
            }
        }

        if (this.captureEmail) {
            if (!EMAIL_REGEX.test(this.email)) {
                PopupManager.show(AlertPopupComponent, {
                    title: 'Please enter a valid email',
                    hideCancelButton: true,
                });
                return;
            } else {
                dataCaptured.email = this.email;
            }
        }

        if (this.capturePhone) {
            if (this.phone.trim() === '') {
                PopupManager.show(AlertPopupComponent, {
                    title: 'Please enter a valid phone number',
                    hideCancelButton: true,
                });
                return;
            } else {
                dataCaptured.phone = this.phone;
            }
        }

        api.updateCoupon(this._coupon, dataCaptured);

        this._closePopup.dispatch(true);
    }

    public async onCancel(): Promise<void> {
        if (await PopupManager.show(AlertPopupComponent, {
            title: 'Are you sure?',
            text: 'This will invalidate your coupon and you will not receive it',
            buttonConfirmText: 'REJECT',
        })) {
            api.updateCoupon(this._coupon, {
                dataCaptureUserCanceled: true,
            });

            this._closePopup.dispatch(false);

        }
    }

    public view() {
        return template(this);
    }

    public get message(): string {
        return this._coupon.coupon.dataCapture.message;
    }

    public get captureName(): boolean {
        return this._coupon.coupon.dataCapture.askName;
    }

    public get captureEmail(): boolean {
        return this._coupon.coupon.dataCapture.askEmail;
    }

    public get capturePhone(): boolean {
        return this._coupon.coupon.dataCapture.askPhone;
    }
}
