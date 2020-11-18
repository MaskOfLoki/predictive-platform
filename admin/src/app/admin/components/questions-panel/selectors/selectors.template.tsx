import m from 'mithril';
import {SelectorsComponent} from './selectors.component';

export function template(ctrl: SelectorsComponent) {
    return (
        <div class='gc-questions-selectors'>
            <div class={`group-select${ctrl.isStarted ? ' disabled' : ''}`}>
                <label>SELECT EVENT</label>
                <select onchange={ctrl.selectEventHandler.bind(ctrl)}>
                    <option value=''
                            selected={ctrl.selectedEvent == null}
                            disabled hidden>
                        - - -
                    </option>
                    {ctrl.events.map(event =>
                        <option value={event.id}
                                selected={ctrl.selectedEvent && ctrl.selectedEvent.id === event.id}>
                            {event.id}
                        </option>)}
                </select>
                <div class='button-add'
                     onclick={ctrl.buttonAddEventHandler.bind(ctrl)}>+
                </div>
                {ctrl.selectedEvent &&
                <div class='button-edit'
                     onclick={ctrl.buttonEditEventHandler.bind(ctrl)}/>}
                {ctrl.events.length > 1 &&
                <div class='button-delete'
                     onclick={ctrl.buttonDeleteEventHandler.bind(ctrl)}/>}
            </div>
            {ctrl.selectedEvent &&
            <div class='group-select'>
                <label>QUESTION SET</label>
                <select onchange={ctrl.selectQuestionSetHandler.bind(ctrl)}>
                    <option value=''
                            selected={ctrl.selectedQuestionSet == null}
                            disabled hidden>
                        - - -
                    </option>
                    {ctrl.selectedEvent.data.map(questionSet =>
                        <option value={questionSet.name}
                                selected={ctrl.selectedQuestionSet === questionSet}>
                            {questionSet.name}
                        </option>)}
                </select>
                <div class={`button-add${ctrl.isStarted ? ' disabled' : ''}`}
                     onclick={ctrl.buttonAddSetHandler.bind(ctrl)}>+
                </div>
                {ctrl.selectedQuestionSet &&
                <div class={`button-edit${ctrl.isStarted ? ' disabled' : ''}`}
                     onclick={ctrl.buttonEditSetHandler.bind(ctrl)}/>}
                {ctrl.selectedEvent.data.length > 1 &&
                <div class={`button-delete${ctrl.isStarted ? ' disabled' : ''}`}
                     onclick={ctrl.buttonDeleteSetHandler.bind(ctrl)}/>}
            </div>}
            {ctrl.selectedQuestionSet &&
            <div class='group-select'>
                <label>ADD QUESTION</label>
                <select onchange={ctrl.selectQuestionTypeHandler.bind(ctrl)}>
                    <option value=''
                            disabled hidden
                            selected>
                        Select Question Type
                    </option>
                    {ctrl.questionTypes.map(questionType =>
                        <option value={questionType.type}>
                            {questionType.label}
                        </option>)}
                </select>
            </div>}
        </div>
    );
}
