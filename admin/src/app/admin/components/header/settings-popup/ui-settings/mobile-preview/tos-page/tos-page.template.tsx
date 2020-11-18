import m from 'mithril';
import { MarkdownEditor } from 'mithril-markdown';
import { TOSPageComponent } from './tos-page.component';

export function template(ctrl: TOSPageComponent) {
    return (
      <div class='mobile-terms-screen' style={{color: ctrl.config.colors.text4}}>
        {m(MarkdownEditor, {
            preview: true,
            markdown: ctrl.terms,
            disabled: true,
        })}
      </div>
    );
}