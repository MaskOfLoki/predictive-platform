import m from 'mithril';
import {DataCapturePopupComponent} from './data-capture-popup.component';

export function template(ctrl: DataCapturePopupComponent) {
    return (<div class='data-capture-container'>
        <div class='data-capture-popup'>
            <div class='margin'>
                <div class='message'>{ctrl.message}</div>
                <div class='inputs'>
                    {ctrl.captureName && <div class='input'>
                        <span>Name</span>
                        <input class='gc-input'
                               value={ctrl.name}
                               oninput={e => ctrl.name = e.target.value}/>
                    </div>}
                    {ctrl.captureEmail && <div class='input'>
                        <span>Email</span>
                        <input class='gc-input'
                               type='email'
                               value={ctrl.email}
                               oninput={e => ctrl.email = e.target.value}/>
                    </div>}
                    {ctrl.capturePhone && <div class='input'>
                        <span>Phone Number</span>
                        <input class='gc-input'
                               type='phone'
                               value={ctrl.phone}
                               oninput={e => ctrl.phone = e.target.value}/>
                    </div>}
                </div>
                <div class='controls'>
                    <button onclick={ctrl.onAccept.bind(ctrl)}>ACCEPT</button>
                    <button onclick={ctrl.onCancel.bind(ctrl)}>CANCEL</button>
                </div>
            </div>
        </div>
    </div>);
}
