import {template} from './rank-screen.template';

import './rank-screen.style.scss';
import {BasePreviewComponent} from '../BasePreviewComponent';

export class RankScreenComponent extends BasePreviewComponent {
  public leaders = [
    {uid: 1, position: 1, username: 'User1284', points: 8327},
    {uid: 2, position: 2, username: 'User987', points: 8320},
    {uid: 3, position: 3, username: 'User1542', points: 8017},
    {uid: 4, position: 4, username: 'User1284', points: 8001},
    {uid: 5, position: 5, username: 'User54367', points: 4723},
    {uid: 6, position: 6, username: 'User2765', points: 2005},
    {uid: 7, position: 7, username: 'User1234', points: 1234},
    {uid: 8, position: 8, username: 'User9075', points: 978},
    {uid: 9, position: 9, username: 'User61438', points: 100},
    {uid: 10, position: 10, username: 'User0', points: 75},
  ];

  public uid = 7;

  public view() {
    return template(this);
  }

}
