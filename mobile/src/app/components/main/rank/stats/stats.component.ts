import {template} from './stats.template';
import './stats.component.scss';
import {ClassComponent} from 'mithril';
import {MiniSignalBinding} from 'mini-signals';
import {api} from '../../../../services/api';
import {
    IBetMoneylineQuestion,
    IGameState,
    IOpenResponseQuestion, IPointsEntry,
    IQuestion, IQuestionAnswer,
    IUser,
} from '../../../../../../../common';
import m from 'mithril';

export class StatsComponent implements ClassComponent {
    private readonly _subscriptions: MiniSignalBinding[] = [];
    private _bucks: number;
    private _position: number;
    private _uid: string;
    private _correctAnswers: string;
    private _questions: IQuestion[] = [];
    private _playerAnswers: IQuestionAnswer[] = [];

    constructor() {
        this._subscriptions.push(api.user.add(this.userHandler.bind(this)));
        this._subscriptions.push(api.overallPosition.add((value: IPointsEntry) => {
            this._position = value ? value.position : 0;
            m.redraw();
        }));
    }

    private async userHandler(value: IUser) {
        if (!value) {
            return;
        }

        this._uid = value.uid;
        this._bucks = value.bucks;
        m.redraw();

        if (this._subscriptions.length === 1) {
            this._subscriptions.push(api.state.add(this.stateHandler.bind(this)));
        }

        api.getOverallPosition();
    }

    private stateHandler(value: IGameState): void {
        if (!value.event) {
            return;
        }

        this._questions = [];
        value.event.data.forEach(questionSet => this._questions = this._questions.concat(questionSet.questions));
        this.calculateCorrectAnswers();
    }

    private async calculateCorrectAnswers() {
        this._playerAnswers = await api.getUserAnswers();

        if (this._questions.length === 0 || this._playerAnswers.length === 0) {
            return;
        }

        let correct = 0;

        for (const answer of this._playerAnswers) {
            const question: IQuestion = this._questions.find(item => item.id === answer.questionId);

            if (!question) {
                return;
            }

            if ((question as IOpenResponseQuestion).correctAnswer &&
                (question as IOpenResponseQuestion).correctAnswer === answer.answer) {
                correct++;
            } else if ((question as IBetMoneylineQuestion).winner &&
                ((question as IBetMoneylineQuestion).winner === answer.team)) {
                correct++;
            }
        }

        this._correctAnswers = `${correct} / ${this._questions.length}`;
        m.redraw();
    }

    public view() {
        return template(this);
    }

    public onremove() {
        this._subscriptions.forEach(item => item.detach());
    }

    public get bucks(): number {
        return this._bucks;
    }

    public get position(): number {
        return this._position;
    }

    public get correctAnswers(): string {
        return this._correctAnswers;
    }
}
