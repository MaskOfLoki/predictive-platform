import {QuestionSetComponent} from './question-set.component';
import m from 'mithril';
import {QuestionComponent} from './question/question.component';
import {formatTimer} from '../../../../../../../../../../../common';

export function template(ctrl: QuestionSetComponent) {
    return (
        <div class='gc-mobile-question-set'>
            <div class='mobile-header'
                style={{backgroundColor: ctrl.config.colors.primary}}>
                <div class='arrow open'
                    style={{backgroundColor: ctrl.config.colors.text4}}/>
                <div class='title' style={{color: ctrl.config.colors.text4}}>
                    WHO WILL WIN
                </div>
                <div class='spacer'/>
                <div class='group-timer'>
                    <div class='icon-timer' style={{backgroundColor: ctrl.config.colors.text4}}/>
                    <span style={{color: ctrl.config.colors.text4}}>
                        {formatTimer(ctrl.countdown)}
                    </span>
                </div>
            </div>
            <QuestionComponent config={ctrl.config} />
        </div>
    );
}
