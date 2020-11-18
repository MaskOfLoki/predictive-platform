import m from 'mithril';
import {PaginationComponent} from './pagination.component';

export function template(ctrl: PaginationComponent) {
    return (
        <div class='gc-pagination'>
            <div class={`arrow${ctrl.current === 0 ? ' disabled' : ''}`}
                 onclick={ctrl.buttonPrevHandler.bind(ctrl)}/>
            <div class={`arrow${ctrl.current + ctrl.pageSize >= ctrl.total ? ' disabled' : ''}`}
                 onclick={ctrl.buttonNextHandler.bind(ctrl)}/>
            <span>
                {ctrl.current + 1} - {ctrl.lastPage} of {ctrl.total}
            </span>
        </div>
    );
}
