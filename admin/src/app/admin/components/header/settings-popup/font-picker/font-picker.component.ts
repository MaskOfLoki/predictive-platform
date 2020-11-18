import { template } from './font-picker.template';
import './font-picker.component.scss';
import { IFont, isEmptyString } from '../../../../../../../../common';
import { fileService } from '../../../../services/FileService';
import { redraw, Vnode } from 'mithril';

interface IFontPickerAttrs {
  onchange: (value?: IFont) => void;
  font: IFont;
}

export class FontPickerComponent {
  private _font: IFont;
  private _onchange: (value?: IFont) => void;

  public oninit(vnode: Vnode<IFontPickerAttrs>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IFontPickerAttrs>) {
    this._onchange = vnode.attrs.onchange;
    this._font = vnode.attrs.font;
  }

  public async buttonUploadHandler() {
    if (this._font) {
      this._font = undefined;
      this._onchange(null);
      return;
    }

    const file = await fileService.select(
      ['.woff', '.woff2', '.ttf', '.otf'].join(', '),
    );

    if (!file) {
      return;
    }

    this._font = {
      name: file.name,
      file: await fileService.upload(file),
    };

    if (this._onchange) {
      this._onchange(this._font);
    }
  }

  public view() {
    return template(this);
  }

  public get font(): IFont {
    return this._font;
  }
}
