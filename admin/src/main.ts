import './styles.scss';
import {BRANCH, VERSION} from '../../common';
import {initRoutes} from './main.routes';

// tslint:disable-next-line:no-console
console.log(`%c Predictive Platform Admin, ${BRANCH}, version ${VERSION}`, 'background: #222; color: #bada55');

function init() {
    initRoutes();
}

init();
