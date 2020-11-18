import m from 'mithril';
import {PollMultipleChoicePopupComponent} from './poll-multiple-choice-popup.component';
import {QuestionHeaderComponent} from '../../question-header/question-header.component';

export function template(ctrl: PollMultipleChoicePopupComponent) {
    return (
        <div class='gc-poll-multiple-choice-popup'>
            <QuestionHeaderComponent question={ctrl.question}
                                     onclose={ctrl.buttonCancelHandler.bind(ctrl)}/>
            <div class='content'>
                <div class='column-left'>
                    <div class='group-input'>
                        <label>QUESTION</label>
                        <input class='gc-input'
                               value={ctrl.question.question}
                               oninput={e => ctrl.question.question = e.target.value}
                               onkeypress={e => e.target.value.length < 100}/>
                    </div>
                    <div class='group-input'>
                        <label>SUBHEADER</label>
                        <input class='gc-input'
                               value={ctrl.question.subHeader}
                               oninput={e => ctrl.question.subHeader = e.target.value}
                               onkeypress={e => e.target.value.length < 100}/>
                    </div>
                    <div class='group-answers'>
                        {ctrl.answers.map((answer, index) =>
                            <div class='group-answer'>
                                <span>ANSWER {index + 1}</span>
                                <input class='gc-input'
                                       value={answer}
                                       oninput={e => ctrl.answers[index] = e.target.value}
                                       onkeypress={e => e.target.value.length < 50}/>
                                {ctrl.answers.length > 2 &&
                                <div class={`button-remove ${ctrl.isStarted ? 'disabled' : ''}`}
                                     onclick={() => ctrl.buttonRemoveAnswerHandler(index)}>X
                                </div>}
                            </div>)}
                    </div>
                    <div class={`gc-button button-add-answer ${ctrl.isStarted ? 'disabled' : ''}`}
                         onclick={ctrl.buttonAddAnswerHandler.bind(ctrl)}>
                        ADD ANSWER
                    </div>
                </div>
                <div class='column-right'>
                    <span>POINTS</span>
                    <input class='gc-input'
                           type='number'
                           value={ctrl.question.points}
                           oninput={e => ctrl.question.points = parseInt(e.target.value)}
                           onkeypress={e => e.target.value.length < 6}/>
                </div>
            </div>
            <div class='buttons'>
                <div class='button' onclick={ctrl.buttonCancelHandler.bind(ctrl)}>
                    CANCEL
                </div>
                <div class='line'/>
                <div class='button' onclick={ctrl.buttonConfirmHandler.bind(ctrl)}>
                    SAVE QUESTION
                </div>
            </div>
        </div>
    );
}
