import { ClassComponent, Vnode, VnodeDOM } from 'mithril';
import { template } from './help-button.template';
import './help-button.component.scss';
import { IQuestion } from '../../../../../../../../../../common';
import { getQuestionHelp } from '../../../../../../../utils/help';
import { configService } from '../../../../../../../services/config';

interface IHelpAttrs {
    question: IQuestion;
}

export class HelpButtonComponent implements ClassComponent<IHelpAttrs> {
    private _question: IQuestion;
    private _element: HTMLElement;
    private _tooltip: HTMLElement;
    private _documentClickHandler: () => void;
    private _html: string;

    public oninit(vnode: Vnode<IHelpAttrs, this>) {
        this.onbeforeupdate(vnode);
    }

    public onbeforeupdate(vnode: Vnode<IHelpAttrs, this>) {
        this._question = vnode.attrs.question;
        this._html = getQuestionHelp(this._question.type);
    }

    public oncreate(vnode: VnodeDOM<IHelpAttrs, this>) {
        this._element = vnode.dom as HTMLElement;
        this._element.style.width = `${this._element.offsetHeight}px`;
        this._element.style.borderRadius = `${this._element.offsetHeight * 0.5}px`;
    }

    public clickHandler(event: Event) {
        event.stopImmediatePropagation();

        if (this._tooltip) {
            this.removeTooltip();
        } else {
            this._tooltip = document.createElement('div');
            this._tooltip.classList.add('gc-help-tooltip');
            this._tooltip.style.backgroundColor = configService.colors.primary;
            this._tooltip.style.color = configService.colors.text4;
            this._tooltip.innerHTML = getQuestionHelp(this._question.type);
            document.body.appendChild(this._tooltip);
            document.addEventListener('click', this._documentClickHandler = () => this.removeTooltip());
            document.addEventListener('mousedown', this._documentClickHandler);
            window.addEventListener('scroll', this._documentClickHandler);
            document.addEventListener('touchmove', this._documentClickHandler);
            document.addEventListener('touchstart', this._documentClickHandler);
            this.updateTooltipPosition();
        }
    }

    private updateTooltipPosition(): void {
        if (!this._tooltip) {
            return;
        }

        const rect = this._element.getBoundingClientRect();
        const top = rect.top -
            (this._tooltip.offsetHeight - this._element.offsetHeight) * 0.5;
        this._tooltip.style.top = `${top}px`;
        this._tooltip.style.left = `${rect.left + this._element.offsetWidth}px`;
    }

    private removeTooltip(): void {
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }

        if (this._documentClickHandler) {
            document.removeEventListener('click', this._documentClickHandler);
            window.removeEventListener('scroll', this._documentClickHandler);
            document.removeEventListener('touchstart', this._documentClickHandler);
            document.removeEventListener('touchmove', this._documentClickHandler);
            document.removeEventListener('mousedown', this._documentClickHandler);
            this._documentClickHandler = null;
        }
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this.removeTooltip();
    }

    public get question(): IQuestion {
        return this._question;
    }

    public get html(): string {
        return this._html;
    }
}
