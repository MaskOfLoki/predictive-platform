import {ClassComponent, Vnode} from 'mithril';
import './accordion.component.scss';
import {template} from './accordion.template';

interface IAccordionAttrs {
    label: string;
}

export class AccordionComponent implements ClassComponent<IAccordionAttrs> {
    private _label: string;

    public isOpen: boolean;

    public oninit(vnode: Vnode<IAccordionAttrs>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IAccordionAttrs>) {
        this._label = vnode.attrs.label;
    }

    public view(vnode: Vnode) {
        return template(this, vnode);
    }

    public get label(): string {
        return this._label;
    }
}
