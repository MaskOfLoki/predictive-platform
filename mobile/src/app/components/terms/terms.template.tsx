import m from 'mithril';
import { TermsComponent } from './terms.component';
import { configService } from '../../services/config';
import { MarkdownEditor } from 'mithril-markdown';

export function template(ctrl: TermsComponent) {
    return (
        <div class='terms-screen' style={{ color: configService.colors.text4 }}>
            {m(MarkdownEditor, {
                preview: true,
                markdown: ctrl.markdown,
                disabled: true,
            })}
        </div>
    );
}
