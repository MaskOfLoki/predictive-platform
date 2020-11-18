import { ClassComponent, Vnode } from 'mithril';
import { IConfig, IFont } from '../../../../../../../../../common';
import { redraw } from 'mithril';

interface IBasePreviewAttrs {
  config: IConfig;
}

let styleFont: HTMLElement;
let font: IFont;

export abstract class BasePreviewComponent implements ClassComponent {
  private _config: IConfig;

  public oninit(vnode: Vnode<IBasePreviewAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IBasePreviewAttrs, this>) {
    this._config = vnode.attrs.config;
    updateFont(this._config.font);
  }

  public abstract view();

  public get config() {
    return this._config;
  }

  public get fontStyle() {
    if (!font) {
      return {};
    }

    return {
      fontFamily: `"${font.name}"`,
    };
  }
}

function updateFont(value: IFont) {
  if (value && font && font.file.path === value.file.path) {
    return;
  }

  if (styleFont) {
    document.head.removeChild(styleFont);
    styleFont = undefined;
  }

  font = value;

  if (value) {
    styleFont = document.createElement('style');
    styleFont.appendChild(
      document.createTextNode(`
            @font-face {
                font-family: "${value.name}";
                src: url(${value.file.url});
            }`),
    );

    document.head.appendChild(styleFont);
  }

  redraw();
}
