import {IAPIService} from './IAPIService';
import {FirebaseAPIService} from './firebase/FirebaseAPIService';

export const api: IAPIService = new FirebaseAPIService();
