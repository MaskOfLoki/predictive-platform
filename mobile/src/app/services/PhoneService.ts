import axios, {AxiosResponse} from 'axios';
import {loading} from './LoadingService';
import {GAME_ID} from '../../../../common';

const URL = 'https://us-central1-game-changer-interactive.cloudfunctions.net/api/phone/';

export class PhoneService {
    public async validatePhone(phone: string): Promise<IValidateResponse> {
        const result: AxiosResponse<IValidateResponse> = await loading.wrap(
            axios.post(`${URL}validate`, {
                phone,
                gid: GAME_ID,
            }));
        return result.data;
    }

    public async validatePin(pin: string, id: string): Promise<void> {
        const result: AxiosResponse<IPinResponse> = await loading.wrap(axios.post(`${URL}pin`, {
            pin,
            id,
            gid: GAME_ID,
        }));

        if (!result.data.validated) {
            throw new Error('Invalid verification code');
        }
    }
}

export interface IValidateResponse {
    id: string;
}

interface IPinResponse {
    validated: boolean;
}
