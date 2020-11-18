import { ClassComponent, Vnode } from 'mithril';
import { template } from './answer-input.template';
import './answer-input.component.scss';
import {
  IQuestion,
  IQuestionAnswer,
  QuestionType,
} from '../../../../../../../../common';

interface IAnswerInputAttrs {
  readonly: boolean;
  value: string;
  onchange: (value: string) => void;
  question: IQuestion;
  answer: IQuestionAnswer;
  correct: boolean;
  subtitle: string;
  maxlength: number;
  average: number;
}

export class AnswerInputComponent implements ClassComponent<IAnswerInputAttrs> {
  private _readonly: boolean;
  private _onchange: (value: string) => void;
  private _question: IQuestion;
  private _answer: IQuestionAnswer;
  private _correct: boolean;
  private _subtitle: string;
  private _maxlength: number;
  private _average: number;

  public value: string;

  public oninit(vnode: Vnode<IAnswerInputAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IAnswerInputAttrs, this>) {
    this._readonly = vnode.attrs.readonly;
    this._onchange = vnode.attrs.onchange;
    this._subtitle = vnode.attrs.subtitle;
    this._maxlength = vnode.attrs.maxlength || 25;
    this._average = vnode.attrs.average || 0;

    const newQuestion = vnode.attrs.question;

    if (this._question !== newQuestion) {
      this._question = vnode.attrs.question;
    }

    if (this.isOpenResponse) {
      this._subtitle = `AVERAGE: ${this._average.toFixed(1)}`;
    }

    this.value = vnode.attrs.value;

    this._answer = vnode.attrs.answer;
    this._correct = vnode.attrs.correct;

    if (typeof this.value === 'number' && isNaN(this.value)) {
      this.value = '';
    }
  }

  public inputHandler(e) {
    this.value = e.target.value;
    this._onchange(this.value);
  }

  public changeHandler(e) {
    this.value = e.target.value.trim();
    this._onchange(this.value);
  }

  public view() {
    return template(this);
  }

  public get readonly(): boolean {
    return this._readonly;
  }

  public get subtitle(): string {
    return this._subtitle;
  }

  public get maxlength(): number {
    return this._maxlength;
  }

  public get question(): IQuestion {
    return this._question;
  }

  public get answer(): IQuestionAnswer {
    return this._answer;
  }

  public get isCorrect(): boolean {
    return this._correct;
  }

  public get isOpenResponse(): boolean {
    return (
      this._question &&
      (this._question.type === QuestionType.POLL_OPEN_RESPONSE ||
        this._question.type === QuestionType.QUESTION_OPEN_RESPONSE)
    );
  }
}
