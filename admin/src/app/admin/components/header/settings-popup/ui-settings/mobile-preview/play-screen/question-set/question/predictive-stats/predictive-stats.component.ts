import { IConfig } from '../../../../../../../../../../../../../common';
import { ClassComponent, Vnode } from 'mithril';
import {template} from './predictive-stats.template';

import './predictive-stats.style.scss';

interface IPredictiveStatsAttrs {
  config: IConfig;
}

export class PredictiveStatsComponent implements ClassComponent {
  public config: IConfig;

  public answers = [
    {answer: 'Answer 1', percentage: 33, bucks: 100},
    {answer: 'Answer 2', percentage: 0, bucks: 200},
    {answer: 'Answer 3', percentage: 67, bucks: 50},
  ];

  public oninit(vnode: Vnode<IPredictiveStatsAttrs, this>) {
    this.onbeforeupdate(vnode);
  }

  public onbeforeupdate(vnode: Vnode<IPredictiveStatsAttrs, this>) {
    this.config = vnode.attrs.config;
  }

  public view() {
    return template(this);
  }
}
