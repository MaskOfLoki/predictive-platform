import { IGCFileData } from '@gamechangerinteractive/gc-firebase';

import {
  IFont,
  IGameState,
  ILogoConfig,
  IOpenResponseQuestion,
  IPointsEntry,
} from '../../../../common';

export interface IStatistics {
  total: number;
  answers: IAnswerInfo[];
}

export interface IAnswerInfo {
  answer: string;
  total: number;
  color: string;
}

export function getRandomColor(): string {
  return `hsl(${Math.floor(Math.random() * 360)}, 100%, 80%)`;
}

export interface IMainboardState {
  leaderboard?: IPointsEntry[];
  poll?: IPoll;
  game?: IGameState;
  layout?: MainboardLayout;
  config?: IMainboardConfig;
  isProcessRunning?: boolean;
}

export interface IMainboardConfig extends ILogoConfig {
  backgroundImage?: IGCFileData;
  titleImage?: IGCFileData;
  backgroundColor?: string;
  textColor?: string;
  headerBarColor?: string;
  oddBarsColor?: string;
  evenBarsColor?: string;
  title?: string;
  font?: IFont;
}

export interface IPoll {
  statistics: IStatistics;
  question: IOpenResponseQuestion;
}

export enum MainboardLayout {
  FULLSCREEN,
  SIDE_SLAB,
  LOWER_THIRD,
}

export function fillDefaultMainboardConfig(
  value?: IMainboardState,
): IMainboardState {
  if (!value) {
    value = {};
  }

  if (!value.config) {
    value.config = {};
  }

  if (!value.config.backgroundColor) {
    value.config.backgroundColor = '#0D254C';
  }

  if (!value.config.headerBarColor) {
    value.config.headerBarColor = '#081429';
  }

  if (!value.config.textColor) {
    value.config.textColor = '#FFFFFF';
  }

  if (!value.config.oddBarsColor) {
    value.config.oddBarsColor = '#1B3F79';
  }

  if (!value.config.evenBarsColor) {
    value.config.evenBarsColor = '#153567';
  }

  if (!value.config.title) {
    value.config.title = 'PGP LEADERBOARD';
  }

  return value;
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r: number = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const params: URLSearchParams = new URLSearchParams(location.search);

export function getQueryParam(name: string): string {
  return params.get(name);
}

export function isXeo(): boolean {
  return params.has('xeo');
}
