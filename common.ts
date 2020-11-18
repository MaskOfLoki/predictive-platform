// {{BRANCH}} is replaced by CircleCI with proper value
let BRANCH = '{{BRANCH}}';

// {{BRANCH}} wasn't replaced make it debug
if (BRANCH.indexOf('{{BR') === 0) {
  BRANCH = 'debug';
}

export { BRANCH };
export const VERSION = '1.b{{BUILD}}';
export const GAME_ID = 'predictive-platform';

export interface IEvent {
  id: string;
  type: EventType;
  data: IQuestionSet[];
  marketingMessages: IMarketingMessage[];
  pregamePopup?: IFileData;
  progressMessage?: string;
  completeMessage?: string;
}

export interface IQuestionSet {
  name: string;
  questions: IQuestion[];
  progressMessage?: string;
  completeMessage?: string;
  scheduleType: ScheduleType;
  countdown?: number;
  startTime?: Date;
  endTime?: Date;
  isStated?: boolean;
  isLocked?: boolean;
  startedTime?: Date;
  started?: boolean;
}

export enum EventType {
  PREDICTIVE = 'predictive',
  BETTING = 'betting',
  ANY = 'any',
}

export enum ScheduleType {
  COUNTDOWN = 'countdown',
  RANGE = 'range',
  MANUAL = 'manual',
}

export interface IQuestion {
  id: string;
  title?: string;
  type: QuestionType;
  awarded?: boolean;
  countdown?: number;
  timer?: number;
  startTime?: Date;
  locked?: boolean;
  pushed?: boolean;
}

export interface IQuestionTeam {
  logo: IFileData;
  name: string;
  odds: number;
}

export interface IQuestionAnswer {
  questionId: string;
  type: QuestionType;
  answer?: string;
  team?: string;
  wager?: number;
  payout?: number;
  uid?: string;
  phone?: string;
  email?: string;
  username?: string;
  phoneType?: string;
}

export interface IGameState {
  sessionId?: string;
  event?: IEvent;
  startTime?: Date;
  latestSetName?: string;
}

export interface ILogoConfig {
  logo?: IFileData;
}

export interface IConfig extends ILogoConfig {
  colors?: IColors;
  popup?: IFileData;
  background?: IFileData;
  gameOverImage?: IFileData;
  gameTitle?: string;
  summaryBelowClock?: string;
  gameOverTitle?: string;
  gameOverSubtitle?: string;
  disclamRulesSummary?: string;
  noCountDownSummary?: string;
  disabledSetLeaderboard?: boolean;
  disabledDailyLeaderboard?: boolean;
  email?: string;
  terms?: string;
  features?: IFeatures;
  font?: IFont;
  rulesUrl?: string;
  userNamePrefix?: string;
  optInMessage?: string;
  ageGateValue?: number;
  ageGateMessage?: string;
}

export interface IFont {
  name: string;
  file: IFileData;
}

export interface IColors {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  text6?: string;
  incorrect?: string;
  correct?: string;
  pushed?: string;
  pending?: string;
}

export type IFeatures = {
  [index in Feature]?: boolean;
};

export enum Feature {
  inlinePollResults = 'inlinePollResults',
  displayPredictivePoints = 'displayPredictivePoints',
  displayPollPoints = 'displayPollPoints',
  enableLeaderboard = 'enableLeaderboard',
  userInfoUsername = 'userInfoUsername',
  userInfoName = 'userInfoName',
  userInfoEmail = 'userInfoEmail',
  userInfoShare = 'userInfoShare',
  allLeaderboardEntries = 'allLeaderboardEntries',
  over18 = 'over18',
  over18Required = 'over18Required',
  filterAge = 'filterAge',
  softGate = 'softGate',
}

export interface ISpreadQuestionTeam extends IQuestionTeam {
  outcomes: ISpreadQuestionTeamOutcome[];
}

export interface ISpreadQuestionTeamOutcome {
  spread: number;
}

export interface IOverUnderQuestionTeam extends IQuestionTeam {
  outcomes: IOverUnderTeamOutcome[];
}

export interface IOverUnderTeamOutcome {
  over?: number;
  under?: number;
}

export interface IBannerQuestion extends IQuestion {
  banner?: IFileData;
  redirectUrl?: string;
}

export interface IBetMoneylineQuestion extends IQuestion {
  teamA: IQuestionTeam;
  teamB: IQuestionTeam;
  min: number;
  max: number;
  americanOdds: boolean;
  winner?: string;
}

export interface IBetPointSpreadQuestion extends IBetMoneylineQuestion {
  teamA: ISpreadQuestionTeam;
  teamB: ISpreadQuestionTeam;
}

export interface IBetOverUnderQuestion extends IBetMoneylineQuestion {
  teamA: IOverUnderQuestionTeam;
  teamB: IOverUnderQuestionTeam;
}

export interface IBetPropQuestionOutcome {
  text: string;
  odds: number;
}

export interface IBetPropQuestion extends IQuestion {
  min: number;
  max: number;
  americanOdds: boolean;
  description: string;
  outcomes: IBetPropQuestionOutcome[];
  correctAnswer?: number;
}

export interface IOpenResponseQuestion extends IQuestion {
  question: string;
  subHeader: string;
  subType?: QuestionSubType;
  points: number;
  correctAnswer?: string;
}

export interface IMultipleChoiceQuestion extends IOpenResponseQuestion {
  answers: string[];
}

export interface IFileData {
  path: string;
  url: string;
}

export interface IMarketingMessage {
  text?: string;
  photo?: IFileData;
  redirectUrl?: string;
  timer: number;
}

export enum QuestionType {
  BET_MONEYLINE = 'bet-moneyline',
  BET_POINT_SPREAD = 'bet-point-spread',
  BET_OVER_UNDER = 'bet-over-under',
  BET_PROP = 'bet-prop',
  QUESTION_MULTIPLE_CHOICE = 'question-multiple-choice',
  QUESTION_OPEN_RESPONSE = 'question-open-response',
  POLL_MULTIPLE_CHOICE = 'poll-multiple-choice',
  POLL_OPEN_RESPONSE = 'poll-open-response',
  BANNER_IMAGE = 'banner-image',
}

export enum QuestionSubType {
  PREDICTIVE = 'predictive',
  TRIVIA = 'trivia',
  LIVE = 'live',
}

export function fillDefaultConfig(config?: IConfig): IConfig {
  if (!config) {
    config = {};
  }

  let colors: IColors = config.colors;

  if (!colors) {
    config.colors = colors = {};
  }

  if (!colors.primary) {
    colors.primary = '#fff';
  }

  if (!colors.secondary) {
    colors.secondary = '#fff';
  }

  if (!colors.tertiary) {
    colors.tertiary = '#eee';
  }

  if (!colors.text1) {
    colors.text1 = '#000';
  }

  if (!colors.text2) {
    colors.text2 = '#000';
  }

  if (!colors.text3) {
    colors.text3 = '#000';
  }

  if (!colors.text4) {
    colors.text4 = '#000';
  }

  if (!colors.text5) {
    colors.text5 = '#000';
  }

  if (!colors.text6) {
    colors.text6 = '#000';
  }

  if (!colors.incorrect) {
    colors.incorrect = '#BA0000';
  }

  if (!colors.correct) {
    colors.correct = '#00B21B';
  }

  if (!colors.pushed) {
    colors.pushed = '#FFD800';
  }

  if (!colors.pending) {
    colors.pending = '#5F5F5F';
  }

  if (isEmptyString(config.gameOverTitle)) {
    config.gameOverTitle = 'GAME OVER';
  }

  if (isEmptyString(config.gameOverSubtitle)) {
    config.gameOverSubtitle = 'Come back for the next event!';
  }

  if (isEmptyString(config.gameTitle)) {
    config.gameTitle = 'Predictive Game Play';
  }

  if (isEmptyString(config.summaryBelowClock)) {
    // tslint:disable-next-line
    config.summaryBelowClock =
      'Predict the answers to the questions. If you win in hundreds of competitors, you will make million.';
  }

  if (isEmptyString(config.userNamePrefix)) {
    config.userNamePrefix = 'Fan';
  }

  if (!config.features) {
    config.features = {};
  }

  setDefaultFeature(config.features, Feature.inlinePollResults, true);
  setDefaultFeature(config.features, Feature.displayPredictivePoints, true);
  setDefaultFeature(config.features, Feature.displayPollPoints, true);
  setDefaultFeature(config.features, Feature.enableLeaderboard, true);
  setDefaultFeature(config.features, Feature.userInfoUsername, true);
  setDefaultFeature(config.features, Feature.userInfoName, false);
  setDefaultFeature(config.features, Feature.userInfoEmail, true);
  setDefaultFeature(config.features, Feature.userInfoShare, true);
  setDefaultFeature(config.features, Feature.allLeaderboardEntries, false);
  setDefaultFeature(config.features, Feature.over18, false);
  setDefaultFeature(config.features, Feature.softGate, false);

  if (config.features[Feature.over18]) {
    if (!config.ageGateValue) {
      config.ageGateValue = 18;
    }
    if (isEmptyString(config.ageGateMessage)) {
      config.ageGateMessage = 'I am {AGE} years of age or older.';
    }
  }

  return config;
}

function setDefaultFeature(features: any, feature: string, value: boolean) {
  features[feature] =
    features[feature] !== undefined ? features[feature] : value;
}

export function isEmptyString(value: string): boolean {
  return value == null || value.split(' ').join('').length === 0;
}

export interface IUser {
  username: string;
  phone: string;
  uid: string;
  bucks: number;
  email: string;
  additional?: {
    [index: string]: any;
  };
}

export function formatTimer(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const mins = Math.floor(seconds / 60);
  seconds -= mins * 60;
  return `${hours}:${mins
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getLeftTime(value: IQuestion): number {
  if (!value || !value.startTime) {
    return 0;
  }

  let result =
    value.timer - Math.round((Date.now() - value.startTime.getTime()) * 0.001);

  if (result < 0) {
    result = 0;
  }

  return result;
}

export function getNumberSign(value: number): string {
  return value > 0 ? '+' : '';
}

export function getNumberWithSign(value: number): string {
  return `${getNumberSign(value)}${value}`;
}

export function oddsAmericanToDecimal(value: number): number {
  if (value >= 100) {
    return value / 100 + 1;
  } else if (value <= -100) {
    return (100 / value) * -1 + 1;
  } else {
    console.error('American odds are never from -99 to 99');
    return 2;
  }
}

export function getPayout(
  question: IOpenResponseQuestion,
  answer: string,
  answers: IQuestionAnswer[],
  ignoreUID?: string,
): number {
  if (question.subType !== QuestionSubType.PREDICTIVE) {
    return question.points;
  }

  const playerAnswers = answers.filter(
    (item) => !(ignoreUID && item.uid === ignoreUID),
  );

  // string -> weight
  const answersMap: any = {};

  if (
    question.type === QuestionType.QUESTION_MULTIPLE_CHOICE ||
    question.type === QuestionType.POLL_MULTIPLE_CHOICE
  ) {
    (question as IMultipleChoiceQuestion).answers.forEach(
      (item) => (answersMap[item] = 1),
    );
  }

  playerAnswers.forEach((item) => {
    if (answersMap[item.answer]) {
      answersMap[item.answer]++;
    } else {
      answersMap[item.answer] = 2;
    }
  });

  if (!answersMap[answer]) {
    answersMap[answer] = 1;
  }

  if (ignoreUID) {
    answersMap[answer]++;
  }

  let total = 0;
  Object.values(answersMap).forEach((item: number) => (total += item));

  const result = Math.round(
    (question.points * (total - answersMap[answer])) / total,
  );

  if (result === 0) {
    return question.points;
  }

  return result;
}

export function isBetQuestion(question: IQuestion): boolean {
  return (
    question.type === QuestionType.BET_MONEYLINE ||
    question.type === QuestionType.BET_POINT_SPREAD ||
    question.type === QuestionType.BET_PROP ||
    question.type === QuestionType.BET_OVER_UNDER
  );
}

export function isPollQuestion(question: IQuestion): boolean {
  return (
    question.type === QuestionType.POLL_MULTIPLE_CHOICE ||
    question.type === QuestionType.POLL_OPEN_RESPONSE
  );
}

export function isMultiChoiceQuestion(question: IQuestion): boolean {
  return (
    question.type === QuestionType.POLL_MULTIPLE_CHOICE ||
    question.type === QuestionType.QUESTION_MULTIPLE_CHOICE
  );
}

export function isPredictive(question: IQuestion): boolean {
  return (
    question.type === QuestionType.QUESTION_OPEN_RESPONSE ||
    question.type === QuestionType.QUESTION_MULTIPLE_CHOICE
  );
}

export function getLogoStyle(value: ILogoConfig): Partial<CSSStyleDeclaration> {
  const result: Partial<CSSStyleDeclaration> = {};

  if (value?.logo) {
    result.backgroundImage = `url(${value.logo.url})`;
  }

  return result;
}

export function getQuestionById(event: IEvent, questionId: string): IQuestion {
  for (const questionSet of event.data) {
    for (const question of questionSet.questions) {
      if (question.id === questionId) {
        return question;
      }
    }
  }

  return null;
}

export function getQuestionSetByQuestion(
  event: IEvent,
  value: IQuestion,
): IQuestionSet {
  return event.data.find((questionSet) =>
    questionSet.questions.find((question) => question.id === value.id),
  );
}

export const MARKETING_MESSAGE_MAX_LENGTH = 100;

export enum LeaderboardType {
  SET,
  DAILY,
  OVERALL,
}

export interface IPointsEntry {
  points: number;
  username: string;
  uid: string;
  phone?: string;
  email?: string;
  sessionId?: string;
  questionSetName?: string;
  position?: number;
  couponStatus?: CouponStatus;
  isFiltered?: boolean;
}

export enum CouponStatus {
  NOT_SENT = 'Not Sent',
  SENT = 'Sent',
  DELIVERED = 'Delivered',
}
