import { ConfigService } from './ConfigService';
import { XeoConfigService } from './XeoConfigService';
import { isXeo } from '../../utils';

let config: ConfigService;

if (isXeo()) {
    config = new XeoConfigService();
} else {
    config = new ConfigService();
}

export const configService: ConfigService = config;
