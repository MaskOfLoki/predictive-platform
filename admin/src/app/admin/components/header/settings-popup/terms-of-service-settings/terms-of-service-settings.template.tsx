import m from 'mithril';
import {TermsOfServiceSettingsComponent} from './terms-of-service-settings.component';
import { MarkdownEditor } from 'mithril-markdown';

export function template(ctrl: TermsOfServiceSettingsComponent) {
    return (
        <div class='gc-terms-of-service-settings'>
            <div class='content'>
                <div class='buttons'>
                    <div class={`gc-button ${ctrl.modified ? '' : 'disabled'}`} onclick={ctrl.onSave.bind(ctrl)}>Save Terms</div>
                </div>
                <div class='subcontent'>
                    {m(MarkdownEditor, {
                        preview: false,
                        markdown: ctrl.markdown,
                        onchange: (value: string, _: string) => ctrl.markdown = value,
                    })}
                </div>

            </div>
        </div>
    );
}
