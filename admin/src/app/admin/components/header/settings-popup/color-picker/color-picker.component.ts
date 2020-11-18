import {ClassComponent, Vnode, VnodeDOM} from 'mithril';
import {template} from './color-picker.template';
import './color-picker.component.scss';
import Pickr from '@simonwep/pickr';
import m from 'mithril';

interface IColorPickerAttrs {
    label: string;
    color: string;
    onchange: (color: string) => void;
}

export class ColorPickerComponent implements ClassComponent<IColorPickerAttrs> {
    private _label: string;
    private _color = '#ff0000';
    private _onchange: (color: string) => void;
    private _pickr;

    public oninit(vnode: Vnode<IColorPickerAttrs, this>) {
        this._label = vnode.attrs.label;
        this._onchange = vnode.attrs.onchange;
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IColorPickerAttrs, this>) {
        if (this._color === vnode.attrs.color || !vnode.attrs.color) {
            return;
        }

        this._color = vnode.attrs.color;

        if (this._pickr) {
            this._pickr.setColor(this._color);
        }
    }

    public oncreate(vnode: VnodeDOM<IColorPickerAttrs, this>) {
        this._pickr = Pickr.create({
            el: vnode.dom.querySelector('.color-picker'),
            theme: 'classic',
            default: vnode.attrs.color,
            defaultRepresentation: 'HEX',
            useAsButton: true,
            components: {
                preview: true,
                hue: true,

                interaction: {
                    input: true,
                    clear: true,
                    save: true,
                },
            },
        });

        this._pickr.on('save', this.colorSaveHandler.bind(this));
    }

    private colorSaveHandler(e) {
        this._color = e.toHEXA().toString();

        if (this._onchange) {
            this._onchange(this._color);
        }

        m.redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._pickr.destroy();
    }

    public get label(): string {
        return this._label;
    }

    public get color(): string {
        return this._color;
    }
}
